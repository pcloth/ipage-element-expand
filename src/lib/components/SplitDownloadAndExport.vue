<template>
    <div class="exportExcelBox" :class="{ isDisabled: disabled||loading }" @click="handleExportFile">
        <slot name="button">
            <el-button v-bind="buttonProps" :disabled="disabled||loading">
                {{ exportButtonText }}
                <template v-if="loading">正在处理：{{currentPage}}/{{pageCount}}</template>
            </el-button>
        </slot>
    </div>
</template>

<script>
// const ExportJsonExcel = require('jsExportExcel');
import ExportJsonExcel from './jsExportExcel.js';
const JSZip = require('jszip');
import { delObjectEmpty } from '../utils'
import {config as $c} from '../config'

const getButtonProps = () => {
    return {
        type: 'primary',
        size: 'mini',
        icon: 'el-icon-download',
    };
};

/**
 * 导出excel
 */
export default {
    name:'SplitDownloadAndExport',
    props: {
        /**
         * 导出excel的配置项，会传递给xlsx库
         */
        xlsxProps:{
            type: Object,
            default() {
                return {};
            },
        },
        /**
         * Array<Object<key:value>>>
         * columns = [<key:value>]
         * key: 字段名，支持.分割
         * title: 标题
         * width: 列宽
         * formatter: 格式化函数
         */
        columns: {
            type: Array,
            default() {
                return [];
            },
        },
        /** 默认的列宽 */
        columnWidth: {
            type: Number,
            default: 10,
        },
        /** 导出按钮的配置  */
        exportButtonProps: {
            type: Object,
            default() {
                return getButtonProps();
            },
        },
        /** 导出按钮的文字描述 */
        exportButtonText: {
            type: String,
            default: '导出',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        fileName: {
            type: String,
            default: '',
        },
        // 使用父组件的数据
        useExternalData: {
            type: Boolean,
            default: false,
        },
        /** 不查询接口，直接使用数据包 */
        excelData: {
            type: Array,
            default() {
                return [];
            },
        },
        // 查询接口
        queryApi: {
            type: Function,
            default() {
                return () => {};
            },
        },
        // 查询间隔
        queryInterval: {
            type: Number,
            default: 1000,
        },
        processQueryDataFunc: {
            type: [Function, undefined],
        },
        // 手动指定total，避免有些大数据接口无法每次处理total
        specifyTotal: {
            type: Number,
            default: -1,
        },
        // 查询参数
        queryParams: {
            type: Object,
            default() {
                return {};
            },
        },
        pageMode: {
            type: String,
            default: $c.get('search.mode'), // page 直接页码分页，offset 偏移量分页
        },
        pageSizeKey: {
            type: String,
            default: $c.get('search.pageSize'),
        },
        pageNumberKey: {
            type: String,
            default: $c.get('search.pageNo'),
        },
        offsetKey: {
            type: String,
            default: $c.get('search.offset'),
        },
        limitKey: {
            type: String,
            default: $c.get('search.limit'),
        },
        dataPath: {
            type: String,
            default: $c.get('response.data'),
        },
        // 总条数key和路径，支持.分割
        totalPath: {
            type: String,
            default: $c.get('response.total'),
        },
        // 每多少条数据分割一次请求
        splitCount: {
            type: Number,
            default: 100,
        },
        // 每多少条数据分割一次文件
        splitFileCount: {
            type: Number,
            default: 10000, // 10000条数据分割一次文件
        },
        fileMode: {
            /** auto 根据splitFileCount 分割文件直接下载，避免浏览器内存占用太多
             *  zip 根据splitFileCount 分割文件，然后打包成zip
             *  full 不分割文件，读取完全部数据直接导出
             */
            type: String,
            default: 'auto',
        },
        beforeAction: {
            type: Function,
            default: () => {},
        },
        beforeCreateExcel: {
            type: Function,
            default: () => {},
        },
        // 是否要删除queryParams查询为空的字段
        delParamsEmpty: {
            type: Boolean,
            default: true,
        }
    },
    computed: {
        buttonProps() {
            return { ...getButtonProps(), ...this.exportButtonProps };
        },
    },
    data() {
        return {
            total: 0, // 当前记录总数
            pageCount: 0, // 总页数
            allData: [], // 所有数据
            currentPage: 1, // 当前页码
            loading: false, // 是否正在导出
        };
    },
    methods: {
        async handleExportFile() {
            this.$emit('clickExport')
            await this.handleExportFileSplit();
        },
        getResponse(res,keyPath){
            const beforeFunc = $c.get('response.beforeFunc')
            if(beforeFunc){
                res = beforeFunc(res)
            }
            return this[keyPath].split('.').reduce((obj, key) => {
                return obj[key];
            }, res);
        },
        getParamsPage(page = 1, size = 1) {
            const params = this.delParamsEmpty ? delObjectEmpty(this.queryParams) : {...this.queryParams}
            if (this.pageMode === 'page') {
                params[this.pageNumberKey] = page;
                params[this.pageSizeKey] = size;
            } else {
                params[this.offsetKey] = (page - 1) * size;
                params[this.limitKey] = size;
            }
            // 清理空字符串和null
            Object.keys(params).forEach(key => {
                if (params[key] === "" || params[key] === null) {
                    delete params[key];
                }
            });
            return params;
        },
        async getThisPageData(page = 1) {
            const params = this.getParamsPage(page, this.splitCount);
            const resp = await this.queryApi(params);
            if (this.processQueryDataFunc) {
                // 如果需要处理查询数据
                return await this.processQueryDataFunc(resp);
            } else {
                return resp;
            }
        },
        // 检查一下总页数并记录数据
        async checkPageCount() {
            if (this.specifyTotal >= 0) {
                // 手动指定total
                this.total = this.specifyTotal;
                this.pageCount = Math.ceil(this.total / this.splitCount);
                return this.total;
            }
            const params = this.getParamsPage(1, 1);
            const res = await this.queryApi(params);
            const total = this.getResponse(res,'totalPath');
            const pageCount = Math.ceil(total / this.splitCount);
            this.pageCount = pageCount;
            this.total = total;
            return total;
        },
        // 生成配置项目
        getOptions() {
            const option = {};
            let fileName = '';
            if (this.fileName) {
                fileName = this.fileName;
            } else {
                fileName = new Date().getTime().toString();
            }
            const sheetFilter = [];
            const sheetHeader = [];
            const columnWidths = [];
            this.columns.forEach((row) => {
                row.title = row.title || row.key;
                sheetFilter.push(row.key);
                sheetHeader.push(row.title);
                const width = row.width || this.columnWidth;
                if (width) {
                    columnWidths.push(width);
                }
            });
            option.fileName = fileName;
            option.sheetFilter = sheetFilter;
            option.sheetHeader = sheetHeader;
            option.columnWidths = columnWidths;
            option.xlsxProps = this.xlsxProps;
            return option;
        },
        // 处理数据深度和formatter
        sheetDataClear(sheetData) {
            sheetData.forEach((row) => {
                this.columns.forEach((col) => {
                    if (col.key.includes('.')) {
                        const keys = col.key.split('.');
                        let value = row;
                        keys.forEach((key) => {
                            value = value?.[key];
                        });
                        row[col.key] = value;
                    }
                    if (col.formatter) {
                        row[col.key] = col.formatter(row[col.key], row);
                    }
                });
            });
            return sheetData;
        },
        async waitQuery(){
            // console.log('wait',this.queryInterval)
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.queryInterval);
            });
        },
        // 分页面处理数据，生成不同的excel文件，然后打包成zip
        async handleExportFileSplit() {
            if (this.beforeAction) {
                await this.beforeAction();
            }
            const option = this.getOptions();
            const { sheetFilter, sheetHeader, columnWidths, fileName } = option;
            this.loading = true;
            try {
                await this.checkPageCount();
            } catch (error) {
                this.handleExportError(error);
                return;
            }
            const apiPageCount = this.pageCount;
            let allData = [];
            let splitFile = false;
            if (this.total > this.splitFileCount && this.fileMode !== 'full') {
                splitFile = true;
            }
            // 如果需要切分文件并压缩文件，就生成blob
            option.saveAsBlob = splitFile && this.fileMode === 'zip';

            if (this.useExternalData && this.excelData) {
                // 从父组件获取数据
                allData = JSON.parse(JSON.stringify(this.excelData));
                this.sheetDataClear(allData);
            } else {
                // 从接口获取数据
                for (let i = 1; i <= apiPageCount; i++) {
                    await this.waitQuery();
                    let sheetData;
                    try {
                        const resp = await this.getThisPageData(i);
                        sheetData = this.getResponse(resp,'dataPath') || [];
                    } catch (error) {
                        this.handleExportError(error);
                        return;
                    }
                    this.sheetDataClear(sheetData);
                    allData = allData.concat(sheetData);
                    this.currentPage = i;
                }
            }

            this.allData = allData;
            if(this.beforeCreateExcel){
                // 如果beforeCreateExcel是异步的，就await一下
                if(this.beforeCreateExcel.constructor.name === 'AsyncFunction'){
                    await this.beforeCreateExcel(allData, option);
                }else{
                    this.beforeCreateExcel(allData, option);
                }
            }
            if (splitFile) {
                // 如果需要切分文件，就生成多个excel文件
                const pageCount = Math.ceil(
                    allData.length / this.splitFileCount
                );
                for (let i = 1; i <= pageCount; i++) {
                    const sheetData = allData.slice(
                        (i - 1) * this.splitFileCount,
                        i * this.splitFileCount
                    );
                    option.fileName = `${fileName}_${i}`;
                    option.datas = [
                        {
                            sheetData: sheetData,
                            sheetName: 'sheet',
                            sheetFilter: sheetFilter,
                            sheetHeader: sheetHeader,
                            columnWidths: columnWidths,
                        },
                    ];
                    const toExcel = new ExportJsonExcel(option); //new
                    const file = toExcel.saveExcel(); //保存
                    if (option.saveAsBlob) {
                        allData.push(file);
                    }
                }
            } else {
                // 如果不需要切分文件，就生成一个excel文件
                option.datas = [
                    {
                        sheetData: allData,
                        sheetName: 'sheet',
                        sheetFilter: sheetFilter,
                        sheetHeader: sheetHeader,
                        columnWidths: columnWidths,
                    },
                ];
                const toExcel = new ExportJsonExcel(option); //new
                toExcel.saveExcel(); //保存
            }
            // this.allData = allData;
            if (option.saveAsBlob) {
                const zip = new JSZip();
                // 多个excel 依次加入(fileName不能相同)
                allData.forEach((file) => {
                    zip.file(file.name, file);
                });
                zip.generateAsync({ type: 'blob' }).then((file) => {
                    file.name = option.fileName;
                    this.saveAs(file);
                    this.handleExportSuccess();
                });
            } else {
                this.handleExportSuccess();
            }
        },
        saveAs(file) {
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(file); // 创建下载的链接
            // 自动点击下载
            downloadElement.href = href;
            downloadElement.style.display = 'none';
            downloadElement.download = file.name; // 下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            setTimeout(() => {
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
            }, 200);
        },
        handleExportSuccess() {
            this.loading = false;
            this.$emit('success');

            // this.msg({ type: 'success', content: '导出成功' });
        },
        // 导出失败
        handleExportError(err) {
            this.loading = false;
            this.$emit('error', err);
            // this.msg({ type: 'warning', content: err });
        },
    },
};
</script>

<style scoped lang="scss">
.exportExcelBox {
    &.isDisabled {
        cursor: not-allowed;
        opacity: 0.5;
        // pointer-events: none;
    }
}
</style>
