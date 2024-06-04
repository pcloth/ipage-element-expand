<template>
    <div class="pageTemplate" :class="className">
        <slot name="search">
            <ISearch ref="isearch" @resetFields="$emit('resetFields')" v-model="filter" v-bind="searchProps" :qData="realPageParams" @searchSuccess="searchSuccess"
                     :search-items="searchItems" @beforeSearch="beforeSearch" @searchFail="searchFail" @searchFinally="searchFinally">
            </ISearch>
        </slot>
        <slot name="operation">
            <div class="operation" :class="operationClass" v-if="(addButton || operationButtons.length || showExport)">
                <RenderCell defaultSlot="button" :isFormItem="false" v-for="item,oix in operations" :item="item"
                            :key="item.id?item.id:`operation${oix}`"></RenderCell>
                 <SplitDownloadAndExport  
                  v-if="showExport"
                  style="margin-left: 10px;"
                  ref="exportOrderShow"
                  file-name="订单列表"
                  v-bind="{
                    queryApi:searchProps.queryFunc,
                    queryParams:{
                      ...filter
                    },
                    columns:exportColumns,
                    ...exportProps
                    }">
                    <template slot="button">
                      <el-button type="" size="small" >导出列表</el-button>
                    </template>
                  </SplitDownloadAndExport>            
            </div>
        </slot>
        <div ref="tablewrap" class="tableWrap" :class="tableWrap">
            <slot name="table">
                <ITable v-loading="dataLoading" :tableProps="tableProps" :tableHeight="tableHeight" :tableSlots="tableSlots" :tableOn="tableOn" ref="table" :data="dataList"
                        :columns="mergeColumns" :showColumnKeys="showColumnKeys"></ITable>
            </slot>
            <slot name="pagination">
                <el-pagination class="pagination" :class="paginationClass" :total="total" :current-page="filterQData.pageNo" :page-size="filterQData.pageSize"
                               @current-change="pageChange" @size-change="handleSizeChange"
                            v-bind="mergePaginationProps"></el-pagination>
            </slot>
        </div>

        <el-dialog v-bind="mergeDialogProps" :visible.sync="showDialog">
            <slot name="dialog-header"></slot>
            <slot name="dialog-content" :row="currentRow">
                <IForm v-model="currentRow" :loading="formLoading" @beforeSubmit="beforeSubmit" @cancel="showDialog=false" @afterSubmit="afterSubmit" ref="iform"
                       v-if="dialogType==='edit'||dialogType==='add'" v-bind="formProps" :formItems="formItems" :formRules="formRules">
                </IForm>
                <slot name="dialog-more" :row="currentRow"></slot>
            </slot>
            <template slot="footer">
                <slot name="dialog-footer" :row="currentRow"></slot>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="jsx">
import { deepAssign,getPathValue } from './utils';
import {config as $c} from './config';

import ITable from './ITable';
import IForm from './IForm';
import ISearch from './ISearch';
import RenderCell from './components/RenderCell';
import ITableColFilter from './components/ITableColFilter';
import SplitDownloadAndExport from './components/SplitDownloadAndExport';

export default {
    name:'IPage',
    components: {
        RenderCell,
        ISearch,
        ITable,
        IForm,
        SplitDownloadAndExport,
        // ITableColFilter
    },
    props: {
        /**
        * 导出的接口
        */
        service:{
          type:Function,
          default:()=>{}
        },
        /**
        * 是否要显示导出
        */
        showExport:{
          type:Boolean,
          default:false
        },
        exportProps:{
          type:Object,
          default:()=>{
            return {}
          }
        },
        /**
        * 导出列配置项 
        */
        exportColumns:{
            type: Array,
            default: () => ([]),
        },
        searchItems: {
            type: Array,
            default: () => ([]),
        },
        searchValue: {
            type: Object,
            default: () => ({}),
        },
        searchProps: {
            type: Object,
            default: () => ({}),
        },
        formProps: {
            type: Object,
            default: () => ({}),
        },
        columns: {
            type: Array,
            default: () => ([]),
        },
        showColumnButton: {
            type: Boolean,
            default: true,
        },
        /** 是否显示字段隐藏控制器 */
        showColumnFilter: {
            type: Boolean,
            default: true,
        },
        // 支持renderCell组件参数格式
        columnButtons: {
            type: Array,
            default: () => ([]),
        },
        columnButtonProps: {
            type: Object,
            default: () => {
                return {};
            },
        },
        paginationProps:{
            type:Object,
            default:()=>({})
        },
        tableProps: {
            type: Object,
            default: () => ({}),
        },
        tableOn: {
            type: Object,
            default: () => ({}),
        },
        tableSlots: {
            type: Object,
            default: () => ({}),
        },
        tableWrap:{
            type:String,
            default:$c.get('class').tableWrap
        },
        tableFixHeight:{
            type:Number,
            default:0
        },
        dialogProps: {
            type: Object,
            default: () => {
                return {
                    appendToBody: true,
                    title: '',
                };
            },
        },
        // 添加按钮
        addButton: {
            type: [Object, Boolean],
            default: () => {
                return {};
            },
        },
        // 工具条
        toolbarButtons:{
            type: [Array, Boolean],
            default: () => {
                return [];
            },
        },
        // 操作区按钮
        operationButtons: {
            type: Array,
            default: () => ([]),
        },
        operationClass:{
            type:String,
            default:$c.get('class').IPageOperation
        },
        paginationClass:{
            type:String,
            default:$c.get('class').IPagePagination
        },
        // 行编辑按钮
        editButton: {
            type: [Object, Boolean],
            default: () => {
                return {};
            },
        },
        // 编辑表单字段
        formItems: {
            type: Array,
            default: () => ([]),
        },
        // 编辑表单校验规则
        formRules: {
            type: Object,
            default: () => ({}),
        },
        // 新增表单打开前接口
        befoceAddOpenFunc: {
            type: Function,
            // default: (loadData) => {
            //     return Promise.resolve({...loadData.data});
            // },
        },
        // 编辑表单打开前接口
        befoceEditOpenFunc: {
            type: Function,
            // default: (loadData) => {
            //     return Promise.resolve({...loadData.data});
            // },
        },
        deleteButton: {
            type: [Object, Boolean],
            default: () => {
                return {};
            },
        },
        // 删除数据
        deleteFunc: {
            type: [Function, Boolean],
            default: false,
        },
        className:{
            type:String,
            default:$c.get('class').IPageRoot
        }
    },
    data() {
        return {
            tableHeight:$c.get('tableHeight'),
            dataList: [],
            dataLoading:false,
            total: 0,
            filterQData: {
                pageNo: 1,
                pageSize: 10,
            },
            filter: this.searchValue,
            formData: {},
            formLoading: false,
            showDialog: false,
            currentRow: {},
            dialogType: '',
            dialogTitle: '',
            dialogProps_: {},
            defaultAddButton: {
                ...$c.get('button'),
                ...$c.get('addButton'),
                on: {
                    click: (_, loadData) => {
                        this._openDialog_('add', loadData);
                    },
                },
            },
            defaultEditButton: {
                ...$c.get('button'),
                ...$c.get('editButton'),
                on: {
                    click: (_, loadData) => {
                        this._openDialog_('edit', loadData);
                    },
                },
            },
            defaultDeleteButton: {
                ...$c.get('button'),
                ...$c.get('deleteButton'),
                on: {
                    click: (_, loadData) => {
                        this.askDelete(loadData);
                    },
                },
            },
            defaultTableToolbar:[
                {
                    ...$c.get('toolbarButton'),
                    ...$c.get('refreshButton'),
                    on:{
                        click: (_, loadData) => {
                            const {$rcell} = loadData
                            $rcell.$el.classList.add('refreshAnimation')
                            this.handleSearch().finally(()=>{
                                $rcell.$el.classList.remove('refreshAnimation')
                            });
                        },
                    }
                }
            ],
            showColumnKeys:[]
        };
    },
    watch: {
        filter: {
            handler() {
                this.filterQData.pageNo = 1;
                this.$emit('update:searchValue', this.filter);
            },
            deep: true,
        },
        searchValue: {
            handler() {
                this.filter = this.searchValue;
            },
            deep: true,
        },
        columns:{
            handler(){
                this._calculateDisplayableFields(this.columns)
            },
            deep:true
        },
    },
    computed: {
        operations() {
            const operations = [];
            if (this.addButton && typeof this.addButton === 'object') {
                operations.push(deepAssign(this.defaultAddButton, this.addButton));
            }
            operations.push(...this.operationButtons);
            if(this.toolbarButtons && Array.isArray(this.toolbarButtons)){
                this.toolbarButtons.forEach(btn=>{
                    operations.push(deepAssign($c.get('toolbarButton'), btn));
                })
            }
            // 刷新按钮移动到操作区
            // this.defaultTableToolbar.forEach(btn=>{
            //     operations.push(deepAssign($c.get('toolbarButton'), btn));
            // })
            return operations;
        },
        mergeColumns() {
            const mergeColumns = this._getColumns(this.columns)
            // 默认数据操作区域
            if(this.showColumnButton){
                const props_ = deepAssign($c.get('columnButtonProps'), this.columnButtonProps);
                mergeColumns.push({
                    ...props_,
                    slots:{
                        /** 筛选可见字段功能 */
                        header:(data,loadData)=>{
                            let className = 'IPage_toolBar'
                            return <div class={className}>
                            <span>{props_.columnProps.label}</span>
                            {this.showColumnFilter?<ITableColFilter 
                                value={this.showColumnKeys}
                                onChangeFilter={(val)=>{
                                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                                    this.showColumnKeys = val
                                }} 
                                allItems={loadData.allItems} 
                                loadData={loadData}/>:null}
                            
                        </div>
                        }
                    },
                    render: ({ row }) => {
                        const buttons = [];
                        if (this.editButton && typeof this.editButton) {
                            buttons.push(
                                ...this._vColumnRenderCell_([deepAssign(this.defaultEditButton, this.editButton)], row)
                            );
                        }
                        if (this.deleteButton && typeof this.deleteButton) {
                            buttons.push(
                                ...this._vColumnRenderCell_(
                                    [deepAssign(this.defaultDeleteButton, this.deleteButton)],
                                    row
                                )
                            );
                        }
                        buttons.push(...this._vColumnRenderCell_(this.columnButtons, row));
                        return buttons;
                    },
                });
            }                
            return mergeColumns;
        },
        mergeDialogProps() {
            return {
                ...$c.get('dialogProps'),
                ...this.dialogProps,
                title: this.dialogTitle,
                ...(this.dialogProps_ || {}),
            };
        },
        mergePaginationProps(){
            const obj =  deepAssign($c.get('paginationProps'),this.paginationProps)
            return obj
        },
        realPageParams(){
            // 根据search.mode参数配置分页参数
            const searchOptions =  $c.get('search')
            let params = {}
            if(searchOptions.beforeFunc){
                params = searchOptions.beforeFunc(this.filterQData)
            }else if(searchOptions.mode==='page'){
                params[searchOptions.pageNo] = this.filterQData.pageNo
                params[searchOptions.pageSize] = this.filterQData.pageSize
            }else if(searchOptions.mode==='offset'){
                params[searchOptions.offset] = (this.filterQData.pageNo-1)*this.filterQData.pageSize
                params[searchOptions.limit] = this.filterQData.pageSize
            }
            return params
        }
    },
    methods: {
        _calculateDisplayableFields(columns){
            const showColumnKeys = []
            columns.forEach(item=>{
                const prop = item.columnProps.prop;
                showColumnKeys.push(prop)
                if(item.children){
                    const children = this._calculateDisplayableFields(item.children)
                    showColumnKeys.push(...children)
                }
            })
            return showColumnKeys
        },
        _getColumns(columns){
            const _columns = []
            columns.forEach(item=>{
                const prop = item.columnProps.prop;
                if(item.children){
                    item.children = this._getColumns(item.children)
                }
                _columns.push({
                    ...item,
                    show:this.showColumnKeys.includes(prop)
                })
            })
            return _columns
        },
        _vColumnRenderCell_(allItems, row) {
            return allItems.map((item) => {
                return (
                    <RenderCell
                        allItems={allItems}
                        item={{ ...$c.get('button'), ...item }}
                        formData={row}
                        isFormItem={false}
                    ></RenderCell>
                );
            });
        },
        // 准备给外部使用的唤醒弹窗方法
        openDialog(row, dialogProps) {
            this.dialogProps_ = dialogProps || {};
            this.currentRow = row;
            this.showDialog = true;
        },
        async _openDialog_(type, loadData) {
            this.dialogType = type;
            let openApi = null;
            if (type === 'add') {
                this.dialogTitle = this.addButton?.dialogTitle || '新增';
                openApi = this.befoceAddOpenFunc;
            } else if (type === 'edit') {
                this.dialogTitle = this.editButton?.dialogTitle || '编辑';
                openApi = this.befoceEditOpenFunc;
            }
            if (openApi) {
                this.showDialog = true;
                this.formLoading = true;
                try {
                    this.currentRow = await openApi(loadData);
                } catch (error) {
                    this.$message.error(error);
                    console.log(error, '错误'); // eslint-disable-line
                } finally {
                    this.formLoading = false;
                }
            } else {
                this.currentRow = {...loadData.data};
                this.showDialog = true;
            }
            this.$nextTick(() => {
                this.$refs.iform?.clearValidate();
            });
        },
        pageChange(pageNo) {
            this.filterQData.pageNo = pageNo;
            this.handleSearch();
        },
        handleSizeChange(pageSize) {
            this.filterQData.pageSize = pageSize;
            this.handleSearch();
        },
        handleSearch(params) {
            return this.$refs.isearch.handleSearch(params);
        },
        _handleSearchNow(params) {
            return this.$refs.isearch._handleSearchNow(params);
        },
        searchSuccess(res) {
            const keyPaths = $c.get('response');
            let data = []
            let total = 0
            if(keyPaths.beforeFunc){
                // 有自定义搜索结果处理函数
                const {data:data_,total:total_} = keyPaths.beforeFunc(res)
                data = data_||[]
                total = total_||0
            }else{
                data = getPathValue(keyPaths.data,res,[])
                total = getPathValue(keyPaths.total,res,0)
            }
            
            this.total = +total;
            this.dataList = data;
            if(this.$refs.table){
                this.$refs.table.doLayout();
            }
            this.$emit("searchSuccess", res);
        },
        beforeSubmit(data) {
            this.$emit('beforeSubmit', data);
        },
        afterSubmit(data) {
            this.handleSearch();
            this.showDialog = false;
            this.$emit('afterSubmit', data);
        },
        askDelete(loadData) {
            if (this.deleteFunc) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.deleteFunc(loadData.data)
                        .then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                            });
                            this.$refs.isearch.handleSearch();
                        })
                        .catch((error) => {
                            this.$message({
                                type: 'error',
                                message: error,
                            });
                        });
                });
            }
            this.$emit('delete-row', loadData);
        },
        beforeSearch(params) {
            this.dataList = []
            this.dataLoading = true;
            this.$emit('beforeSearch', params);
        },
        searchFail(data){
            this.$emit("searchFail", data);
        },
        searchFinally(data){
            this.$emit("searchFinally", data);
            this.dataLoading = false;
        },
        //设置表格高度
        tableHeightUpdate() {
            if (this.resize) {
                this.resize = clearTimeout(this.resize);
            }
            this.resize = setTimeout(() => {
                //   //获取工具栏的尺寸
                let dataHeaderSize = this.$refs.tablewrap?.clientHeight;
                //   //计算尺寸
                this.tableHeight = dataHeaderSize?dataHeaderSize:undefined;
                // console.log(this.tableHeight,'tableHeightUpdate')
                if(this.tableHeight){
                    this.tableHeight= Math.ceil(this.tableHeight)
                }
                //   //更新布局
                this.$nextTick(() => {
                    this.$emit('tableHeightUpdate',this.tableHeight)
                    this.$refs.table && this.$refs.table.reSize();
                });
            }, 300);
        },
        tableHeightEventSwitch(on) {
            window[['addEventListener', 'removeEventListener'][on ? 0 : 1]]('resize', this.tableHeightUpdate, false);
        },
    },
    created() {
        const tableHeightMode = $c.get('tableHeightMode')
        if(tableHeightMode==='parent'){
            //更新表格高度
            this.tableHeightUpdate();

            //监听页面尺寸变化
            this.tableHeightEventSwitch(1);
        }else if(tableHeightMode==='data'){
            this.tableHeight = 0
        }
        this.showColumnKeys =  this._calculateDisplayableFields(this.columns)        
    },
};
</script>

<style lang="scss">
.pageTemplate {
    min-height: 500px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .operation {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 20px;
    }

    .pagination {
        margin-top: 20px;
    }
}

.tableWrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    min-width: 0;
}
@keyframes refreshRotate{
    0%{ -webkit-transform: rotate(0deg);}
    50%{ -webkit-transform: rotate(180deg);}
    100%{ -webkit-transform: rotate(360deg);}
}
.refreshAnimation {
    animation:refreshRotate 1s linear infinite;
}

.IPage_toolBar {
    display: flex;
    align-items: center;
    justify-content: space-between;  
}
</style>