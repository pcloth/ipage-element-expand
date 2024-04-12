<!--
 * @Description: 
 * @Author: Ran junlin
 * @Date: 2023-08-17 09:32:25
 * @LastEditTime: 2023-11-01 14:26:43
 * @LastEditors: Ran junlin
-->
<template>
    <el-select v-model="customValue" style="width: 100%" v-bind="$props" filterable remote clearable reserve-keyword
               :placeholder="placeholder" :remote-method="handleRemoteSearch" v-el-select-loadmore="that" @change="handleChange"
               @clear="handleClear" @visible-change="handleVisibleChange">
        <div class="statusIcon" slot="prefix">
            <i v-if="customLoading" class="el-icon-loading"></i>
        </div>
        <div :class="[customLoading ? 'selectLoad' : 'noData']">
            <el-option-group :label="echoGroupTitle">
                <el-option v-for="(item, index) in echoOptions" :key="item[keyField] ? item[keyField] : index" :label="getLabel(item)"
                       :value="item[valueField]" :disabled="disabledFunc(item)" />
            </el-option-group>
            <el-option-group :label="searchGroupTitle">
                <el-option v-for="(item, index) in options" :key="item[keyField] ? item[keyField] : index" :label="getLabel(item)"
                       :value="item[valueField]" :disabled="disabledFunc(item)" />
            </el-option-group>
            
        </div>
    </el-select>
</template>
<script>
import { Select } from "element-ui";
const { props: elSelectProps } = Select;
import { config as $c } from "../config";
import { getPathValue,preventRepeat } from "../utils";

export default {
    props: {
        ...elSelectProps,
        value: {
            type: [String, Object, Number, Boolean, Array],
            default: "",
        },
        service: {
            type: Function,
            default: () => () => {},
        },
        labelField: {
            type: String,
            default: "name",
        },
        valueField: {
            type: String,
            default: "value",
        },
        keyField: {
            type: String,
            default: "id",
        },
        /**
         * 接口查询的字段，默认 keyword
         */
        searchKey: {
            type: String,
            default: "keyword",
        },
        /**
         * 额外要传入的参数
         */
        additionalParams: {
            type: Object,
            default: () => ({}),
        },
        /**
         * 传入要禁用项的函数，返回true表示禁用，返回false表示不禁用
         */
        disabledFunc: {
            type: Function,
            default: () => false,
        },
        /**
         * 显示的多个label，支持数组，根据 - 分割
         */
        labelFieldArr: {
            type: Array,
            default: () => [],
        },
        /** 用于自己控制显示label */
        labelFunc: {
            type: Function,
        },
        echoGroupTitle:{
            type: String,
            default: "回显数据",
        },
        searchGroupTitle:{
            type: String,
            default: "搜索数据",
        },
        placeholder: {
            type: String,
            default: "搜索选择",
        },
        echoFunc: {
            type: Function,
        },
    },
    data() {
        return {
            customValue: this.value,
            params: {
                pageNo: 1,
                pageSize: 10,
                keyword: "",
            },
            customLoading: false,
            // 用于滚动刷新
            that: this,
            options: [],
            echoOptions: [],
            queryWord: "",
            total: 0,
        };
    },
    directives: {
        "el-select-loadmore": {
            bind(el, binding) {
                const componentInstance = binding.value;
                const scrollDom = el.querySelector(".el-select-dropdown__wrap");
                if (scrollDom) {
                    scrollDom.addEventListener("scroll", () => {
                        if (
                            scrollDom.scrollTop + scrollDom.clientHeight >=
                            scrollDom.scrollHeight - 4
                        ) {
                            componentInstance.handleScrollToEnd();
                        }
                    });
                }
            },
        },
    },
    watch: {
        value: {
            handler(value) {
                this.customValue = value;
            },
            immediate: true,
        },
        customValue(val) {
            this.$emit("input", val);
        },
    },
    computed: {
        noData() {
            return this.options.length === this.total;
        },
    },
    async created() {
        this.getList = preventRepeat((params)=>this._getList(params), 500);
        this.init();
    },
    methods: {
        getValueByPath(obj, path) {
            const keys = path.split(".");
            let result = obj;
            for (let key of keys) {
                result = result[key];
                if (!result) return null;
            }
            return result;
        },
        getLabel(item) {
            if(this.labelFunc){
                return this.labelFunc(item);
            }
            if (this.labelFieldArr.length === 0) {
                return item[this.labelField];
            } else {
                return this.labelFieldArr
                    .map((field) => this.getValueByPath(item, field))
                    .join(" - ");
            }
        },
        async init() {
            this.total = 0;
            this.queryWord = "";
            this.params.pageNo = 1;
            this.options = [];
            if(this.value && this.echoFunc && !this.echoOptions.length){
                // 没有回显数据的时候才调用
                this.echoOptions = await this.echoFunc();
            }
        },
        handleVisibleChange(show) {
            if(show){
                if (this.options.length === 0) {
                    this.init();
                    this.getList();
                }
            }
        },
        handleClear() {
            this.echoOptions = [];
            this.init()
        },
        handleChange(args) {
            if (Array.isArray(args)) {
                // 多选
                const selected = this.options.filter((it) =>
                    args.includes(it[this.valueField])
                );
                this.echoOptions = selected;
                this.$emit("getCurrentItem", selected, args);
            } else {
                // 单选
                const currentItem = this.options.find(
                    (it) => it[this.valueField] === args
                );
                this.echoOptions = [currentItem];
                this.$emit("getCurrentItem", currentItem, args);
            }
        },
        realPageParams() {
            // 根据search.mode参数配置分页参数
            const searchOptions = $c.get("search");
            let params = {};
            if (searchOptions.beforeFunc) {
                params = searchOptions.beforeFunc(this.params);
            } else if (searchOptions.mode === "page") {
                params[searchOptions.pageNo] = this.params.pageNo;
                params[searchOptions.pageSize] = this.params.pageSize;
            } else if (searchOptions.mode === "offset") {
                params[searchOptions.offset] =
                    (this.params.pageNo - 1) * this.params.pageSize;
                params[searchOptions.limit] = this.params.pageSize;
            }
            return params;
        },
        getList(){},
        async _getList(query) {
            try {
                this.customLoading = true;
                let queryWord = query || this.queryWord;
                const params = {
                    ...this.realPageParams(),
                    ...this.additionalParams,
                };
                if(queryWord){
                    params[this.searchKey] = queryWord;
                }
                const res = await this.service(params);
                const keyPaths = $c.get("response");
                let data = [];
                let total = 0;
                if (keyPaths.beforeFunc) {
                    const { data: data_, total: total_ } =
                        keyPaths.beforeFunc(res);
                    data = data_ || [];
                    total = total_ || 0;
                } else {
                    data = getPathValue(keyPaths.data, res, []);
                    total = getPathValue(keyPaths.total, res, 0);
                }
                this.options = [...this.options, ...data];
                this.total = total;
            } catch (error) {
                this.$message.error(error.message || "加载失败");
            } finally {
                setTimeout(()=>{
                    this.customLoading = false;
                },200)
            }
        },
        handleRemoteSearch(query) {
            this.options = [];
            this.queryWord = query;
            this.params.pageNo = 1;
            this.getList(this.queryWord);
        },
        handleScrollToEnd() {
            if (!this.customLoading && this.options.length < this.total) {
                this.params.pageNo++;
                this.getList(this.queryWord);
            }
        },
    },
};
</script>
<style lang="scss">
.selectLoad:after {
    position: relative;
    z-index: 1000;
    content: "加载中...";
    display: inline-block;
    text-align: center;
    color: #979797;
    width: 100%;
    line-height: 30px;
    overflow: hidden;
    font-size: 13px;
}
.noData:after {
    position: relative;
    z-index: 1000;
    content: "已经到底了";
    color: #979797;
    display: inline-block;
    text-align: center;
    width: 100%;
    line-height: 30px;
    overflow: hidden;
    font-size: 13px;
}

.statusIcon {
    display: flex;
    height: 100%;
    align-items: center;
}
</style>
