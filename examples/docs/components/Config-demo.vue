<template>
    <div>
        <IPage :columns="columns" :searchItems="searchItems" v-bind="otherProps" :formItems="formItems" :formRules="formRules"></IPage>
    </div>
</template>

<script lang="jsx">
import { config } from "../../../src";
config.set({
    class: {
        /**IPage组件根节点附加class */
        IPageRoot: "ipage",
        /** ISearch组件根节点附加class */
        ISearchRoot: "isearch",
        /** ITable组件根节点附加class */
        ITableRoot: "itable",
        /** IForm组件根节点附加class
         *  以这个优先
         */
        IFormRoot: "iform",
        /** 操作区额外的class */
        IPageOperation: "ipage_operation",
        /** 表格外层的class */
        tableWrap: "ipage_tableWrap",
        /** 分页区额外的class */
        IPagePagination: "ipage_pagination",
    },
    /// IPage 相关参数
    /** 返回值所在的地方 */
    response: {
        /** ITable需要的data数据 */
        data: "data.records",
        /** 分页组件需要的total数据 */
        total: "data.total",
        /** 自定义返回值处理函数
         * 函数返回值必须是一个对象，包含两个属性
         * data: 返回的数据
         * total: 返回的总数
         */
        beforeFunc: null,
    },
    /** 搜索分页相关参数 */
    search: {
        /** page=页码模式，offset=偏移模式 */
        mode: "page",
        /** 页码模式参数 */
        pageSize: "pageSize",
        pageNo: "pageNo",
        /** 偏移模式参数  */
        limit: "limit",
        offset: "offset",
        /** 自定义搜索参数处理函数
         * @param {object} params 当前的搜索参数
         * @returns {object} 返回一个对象，分页需要的参数
         */
        beforeFunc: null,
    },

    /** 表格高度锁：仅在IPage组件中的ITable生效
     * parent=会自动撑满<父组件>，有滚动条
     * data=会显示全部数据撑开页面，不会有滚动条
     *  */
    tableHeightMode: "parent", //
    /** 如果不是自动高度，将会撑满页面高度 */
    tableHeight: 0,
    /** 弹窗默认的属性，将直接传递给IPage使用的增改数据el-dialog中 */
    dialogProps: {
        width: "50%",
        appendToBody: true,
    },
    /** 弹窗默认的事件，将直接传递给IPage使用的增改数据el-dialog中 */
    dialogOn: {},

    /** ITable 组件的默认传入数据，用来渲染表格操作栏 */
    columnButtonProps: {
        columnProps: {
            label: "操作",
            minWidth: 140,
            fixed: "right",
        },
    },
    /** 默认的el-pagination 组件的参数，直接传递给el-pagination */
    paginationProps: {
        layout: "total, sizes, prev, pager, next, jumper",
    },
    /** 默认toolbar上的RenderCell组件数据 */
    toolbarButton: {
        slot: "button",
        props: {
            size: "small",
            type: "text",
        },
    },
    /** 默认按钮的RenderCell组件数据
     * 将用在addButton,deleteButton和默认的columnButtons里面
     */
    button: {
        slot: "button",
        props: {
            size: "small",
            type: "text",
        },
    },
    /** 默认的addButton按钮RenderCell组件数据
     * 注意：IPage在使用addButton的时候，会再叠加一个on:{click:fn}的事件
     */
    addButton: {
        id: "add",
        tip: "新增",
        props: {
            size: "small",
            type: "primary",
            icon: "el-icon-plus",
        },
    },
    /** 默认的editButton按钮RenderCell组件数据
     * 注意：IPage在使用editButton的时候，会再叠加一个on:{click:fn}的事件
     */
    editButton: {
        id: "edit",
        tip: "编辑",
    },
    /** 默认的deleteButton按钮RenderCell组件数据
     * 注意：IPage在使用deleteButton的时候，会再叠加一个on:{click:fn}的事件
     */
    deleteButton: {
        id: "delete",
        tip: "删除",
    },
    /** 默认的refreshButton按钮RenderCell组件数据
     * 注意：IPage在使用refreshButton的时候，会再叠加一个on:{click:fn}的事件
     */
    refreshButton: {
        id: "refresh",
        props: {
            icon: "el-icon-refresh",
        },
    },
    /// IForm 相关参数
    /** 直接传递给IFrom组件内的el-form组件的class */
    formClass: "iform", // 旧版本参数，后续可能会删除
    /** 直接传递给IFrom组件内的el-form组件 */
    formProps: {
        "label-width": "120px",
    },
    /** 直接传递给IFrom组件内的el-form-item组件 */
    formOn: {},
    /** IFrom组件的按钮区域RenderCell组件array */
    expandButtons: [],

    ////// 这部分参数暂时先做兼容处理，后续可能会删除，以后会变成RenderCell组件参数
    /** 是否显示IFrom组件的提交按钮 */
    showSubmitButton: true,
    submitTitle: "确定",
    cancelTitle: "取消",
    submitButtonProps: {
        type: "primary",
    },
    showCancelButton: false,
    cancelButtonProps: {
        type: "default",
    },
    /** 优化后的表单提交按钮 RenderCell 组件参数，或者false表示不显示 */
    formSubmitButton: {
        slot: "button",
        props: {
            type: "primary",
        },
    },
    /** 优化后的表单取消按钮 RenderCell 组件参数，或者false表示不显示 */
    formCancelButton: false,
    submitPreventRepeat: false,
    /// ISearch 相关参数
    /** ISearch组件内部的el-form参数 */
    searchFormProps: {
        inline: true,
    },
    searchInput: {
        props: {
            size: "small",
            clearable: true,
        },
    },
    searchButton: {
        props: {
            size: "small",
        },
    },
    // 旧版本的参数，后续可能会删除，并替换成RenderCell组件参数
    showSearchButton: true,
    searchButtonProps: {
        type: "primary",
        icon: "el-icon-search",
        size: "small",
    },
    showResetButton: true,
    resetButtonProps: {
        type: "default",
        icon: "",
        size: "small",
    },
    // 新版本参数
    searchSubmitButton: {
        slot: "button",
        props: {
            icon: "el-icon-search",
            type: "primary",
            size: "small",
        },
    },
    searchResetButton: {
        slot: "button",
        props: {
            type: "default",
            size: "small",
        },
    },
    /** 强制所有搜索项目进more 比如在有些手机尺寸上可以用这个控制 */
    allinMore: false,
    /// ITable 相关参数
    tableProps: {},
    tableOn: {},
    /** 扩展渲染组件，请用jsx直接传入vnode */
    extendedRenderCell:{
        demo:(h,{$rcell})=>{
            /** 如果是要渲染一个不需要props参数、事件、以及v-model的组件
             * 需要设置这三个属性为false
             * h参数比如引入，不然可能报错
             */
            $rcell.needEvent = false
            $rcell.needProps = false
            $rcell.needVModel = false
         return <span>11</span>
        }
        /** 这种需要props、event和v-model的，直接渲染即可 */
        // demo:(h)=> <el-input></el-input>
    }
});
export default {
    data() {
        return {
            searchItems:[
                // 姓名，性别，最小成绩
                {
                    id:'demo',
                    slot:'demo',
                    label:'自定义组件',
                    props:{
                        placeholder:'请输入demo',
                    }
                },
                {
                    id:"name",
                    slot:"input",
                    label:"姓名",
                    props:{
                        placeholder:"请输入姓名",
                    }
                },
                {
                    id:"gender",
                    slot:"select",
                    label:"性别",
                    props:{
                        placeholder:"请选择性别",
                    },
                    options:[
                        {
                            label:"男",
                            value:1,
                        },
                        {
                            label:"女",
                            value:2,
                        }
                    ]
                },
                {
                    id:"minScore",
                    slot:"input",
                    label:"最小成绩",
                    props:{
                        type:'number',
                        placeholder:"请输入最小成绩",
                    }
                }
            ],
            formItems: [
                {
                    id: "name",
                    slot: "input",
                    label: "姓名",
                    props:{
                        placeholder:"请输入姓名"
                    }
                },
                // 性别、成绩、考试日期
                {
                    id:"gender",
                    slot:"select",
                    label:"性别",
                    props:{
                        placeholder:"请选择性别",
                    },
                    options:[
                        {
                            label:"男",
                            value:1,
                        },
                        {
                            label:"女",
                            value:2,
                        }
                    ]
                },
                {
                    id:"score",
                    slot:"input",
                    label:"成绩",
                    props:{
                        placeholder:"请输入成绩",
                    }
                },
                {
                    id:"date",
                    slot:"date-picker",
                    label:"考试日期",
                    props:{
                        placeholder:"请选择考试日期",
                    }
                }
            ],
            formRules: {
                name: [
                    { required: true, message: "请输入name", trigger: "blur" },
                ],
            },
            columns:[
                {
                    columnProps:{
                        prop:'name',
                        label:'姓名',
                        minWidth:100,
                    }
                },
                {
                    columnProps:{
                        prop:'gender',
                        label:'性别',
                        width:100,
                        formatter:(row)=>{
                            return {1:'男',2:'女'}[row.gender]||'-未知-'
                        }
                    }
                },
                {
                    columnProps:{
                        prop:'score',
                        label:'成绩',
                        width:100,
                    }
                },
                {
                    columnProps:{
                        prop:'date',
                        label:'考试日期',
                        width:100,
                    }
                },
            ],
            otherProps:{
                searchProps:{
                    queryFunc:this.fetchDataList,
                    autoQuery:true
                }
            }
        };
    },
    methods:{
        async fetchDataList(params){
            console.log('fetchDataList',params); // eslint-disable-line
            const records = []
            const total = 40
            for(let i=0;i<total;i++){
                records.push({
                    name:'张三',
                    gender:1,
                    score:total+i,
                    date:'2020-01-01'
                })
            }
            return await new Promise(resolve => {
                setTimeout(()=>{
                    resolve({
                        data:{
                            records,
                            total:total+500
                        },
                    })
                },2000);
            })
        }
    }
};
</script>

<style>
</style>