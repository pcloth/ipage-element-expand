## 介绍

这是一个集成了增删改查的一个标准页面封装，为了更快速的交付业务。

:::demo 搜索组件是一个对el-form表单的封装，所有的输入单元和按钮都是`RenderCell`组件
```html
<template>
    <IPage 
        :searchValue.sync="searchValue"
        @resetFields="resetFields"
        v-bind="ipageProps" 
    />
</template>
<script>
    export default {
        data(){
            return {
                searchValue:{
                    ck:'1'
                },
                ipageProps:{
                    searchProps:{
                        queryFunc:this.queryFunc
                    },
                    searchItems:[
                        {
                            id:'name',
                            label:'姓名',
                            props:{
                                placeholder:"请输入姓名"
                            },
                        },
                        {
                            id:'ck',
                            label:'测试',
                            slot: 'checkbox',
                            props: {
                                trueLabel: '1',
                                falseLabel: '0',
                            },
                        },
                        {
                            id:'gender',
                            label:'性别',
                            slot:'select',
                            props:{
                                placeholder:"请选择性别"
                            },
                            options:[
                                {
                                    label:'男',
                                    value:1
                                },
                                {
                                    label:'女',
                                    value:2
                                },
                                {
                                    label:'保密',
                                    value:3,
                                    disabled:true
                                }
                            ]
                        },
                    ],
                    columns:[
                        {
                            columnProps:{
                                prop:'name',
                                label:'姓名'
                            }
                        },
                        {
                            columnProps:{
                                prop:'gender',
                                label:'性别',
                                formatter:(val)=>{
                                    return {
                                        1:'男',
                                        2:'女',
                                        3:'保密'
                                        }[val.gender]
                                }
                            }
                        }
                    ],
                    formItems:[
                        {
                            id:'name',
                            label:'姓名',
                            slot:'input',
                            props:{
                                placeholder:"请输入姓名"
                            },
                        },
                        {
                            id:'gender',
                            label:'性别',
                            slot:'select',
                            props:{
                                placeholder:"请选择性别"
                            },
                            options:[
                                {
                                    label:'男',
                                    value:1
                                },
                                {
                                    label:'女',
                                    value:2
                                },
                                {
                                    label:'保密',
                                    value:3,
                                }
                            ]
                        },
                    ],
                    deleteFunc:async (data)=>{
                        // 发起删除请求
                        return true
                    },
                    formProps:{
                        submitFunc:async (data)=>{
                            // 发起保存请求
                            return true
                        }
                    }
                }
                
            }
        },
        methods:{
            resetFields(form){
                console.log('resetFields',form===this.searchValue,form,this.searchValue)
            },
            async queryFunc(params){
                return new Promise((resolve, reject) => {
                    const records = []
                    for(let i=0;i<10;i++){
                        records.push({
                            name:'张三',
                            gender:(i%2)+1,
                        })
                    }
                    setTimeout(()=>{
                        resolve({
                            data:{
                                records
                            },
                            total:records.length
                        })
                    },1500)
                })
            },
        }
    }
</script>
```


:::

## Attributes 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| searchItems | `Array<CellItemType>` | `() => []` | 搜索表单项配置数组 |
| searchValue | `Object` | `() => ({})` | 搜索表单绑定值 |
| searchProps | `Object` | `() => ({})` | 传递给 ISearch 组件的属性，请查询`ISearch组件文档` |
| formProps | `Object` | `() => ({})` | 传递给 IForm 组件的属性，请查询`IForm组件文档` |
| columns | `Array<ColumnType>` | `() => []` | 表格列配置数组 |
| showColumnButton | `Boolean` | `true` | 是否显示列操作按钮 |
| showColumnFilter | `Boolean` | `true` | 是否显示列隐藏控制器 |
| columnButtons | `Array<CellItemType>` | `() => []` | 列操作按钮配置，如果要使用el-table-column组件插槽的scope参数，可以去`loadData.qData`中查找 |
| columnButtonProps | `CellItemType` | `() => ({})` | 列按钮公共配置 |
| paginationProps | `Object` | `() => ({})` | 分页器属性配置 |
| tableProps | `Object` | `() => ({})` | 传递给 ITable 的属性 |
| tableOn | `Object` | `() => ({})` | ITable 事件监听器 |
| tableSlots | `Object` | `() => ({})` | ITable 插槽配置 |
| tableWrap | `String` | `$c.get("class").tableWrap` | 表格容器类名 |
| dialogProps | `Object` | `{ appendToBody: true, title: "" }` | 弹窗属性配置，请查看`el-dialog组件文档` |
| addButton | `CellItemType\|Boolean` | `() => ({})` | 新增按钮配置 |
| toolbarButtons | `Array<CellItemType>\|Boolean` | `() => []` | 工具栏按钮配置 |
| operationButtons | `Array` | `() => []` | 操作区按钮配置 |
| operationClass | `String` | `$c.get("class").IPageOperation` | 操作区类名 |
| paginationClass | `String` | `$c.get("class").IPagePagination` | 分页器类名 |
| editButton | `CellItemType\|Boolean` | `() => ({})` | 编辑按钮配置 |
| formItems | `Array<CellItemType>` | `() => []` | 表单字段配置数组 |
| formRules | `Object` | `() => ({})` | 表单校验规则 |
| befoceAddOpenFunc | `Function` | - | 新增弹窗打开前回调函数 |
| befoceEditOpenFunc | `Function` | - | 编辑弹窗打开前回调函数 |
| deleteButton | `CellItemType\|Boolean` | `() => ({})` | 删除按钮配置 |
| deleteFunc | `Function\|Boolean` | `false` | 删除操作函数 |
| className | `String` | `$c.get("class").IPageRoot` | 根容器类名 |
| reloadForm | `Boolean` | `false` | 是否在打开时重绘表单 |

## Methods 方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| handleSearch | `(params: Object = {})` | `Promise` | 触发搜索操作 |
| askDelete | `(loadData: LoadDataType)` | `Promise` | 执行删除前的确认操作 |
| openDialog | `(row: Object, dialogProps: Object)` | `void` | 手动打开弹窗 |
| pageChange | `(pageNo: Number)` | `void` | 分页页码变化处理 |
| handleSizeChange | `(pageSize: Number)` | `void` | 分页大小变化处理 |
| tableHeightUpdate | - | `void` | 更新表格高度计算 |
| tableHeightEventSwitch | `(on: Boolean)` | `void` | 窗口resize事件开关 |

## Emits 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| resetFields | - | 搜索表单重置时触发 |
| update:searchValue | `(value: Object)` | 搜索值更新时触发 |
| searchSuccess | `(res: Object)` | 搜索成功时触发（带响应数据） |
| beforeSearch | `(params: Object)` | 搜索请求发起前触发 |
| searchFail | `(data: Object)` | 搜索失败时触发 |
| searchFinally | `(data: Object)` | 搜索完成时触发（无论成功失败） |
| beforeSubmit | `(data: Object)` | 表单提交前触发 |
| validationFailed | `(data: Object)` | 表单校验失败时触发 |
| afterSubmit | `(data: Object)` | 表单提交成功后触发 |
| delete-row | `(loadData: LoadDataType)` | 删除行时触发 |
| delete-error | `(error: Error)` | 删除失败时触发 |
| tableHeightUpdate | `(height: Number)` | 表格高度变化时触发 |