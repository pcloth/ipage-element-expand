## 表格组件

:::tip
单独使用 ITable 组件，需要手动指定 tableHeight，因为系统默认它是 0
多级表头，可以把配置放到children里
也可以支持slots插槽
:::

### 基本用法

:::demo 表格组件的基本用法，和 el-table 基本一致

```html
<template>
    <ITable :data="dataList" :columns="columns" tableHeight="auto" />
</template>
<script>
    export default {
        data() {
            return {
                value:'test',
                dataList: [],
                columns: [
                    {
                        columnProps: {
                            prop: "name",
                            label: "姓名",
                        },
                    },
                    {
                        columnProps: {
                            prop: "gender",
                            label: "性别",
                            width: 100,
                            formatter: (row) => {
                                return { 1: "男", 2: "女" }[row.gender];
                            },
                        },
                    },

                    {
                        columnProps: {
                            label: "联络地址",
                        },
                        children: [
                            {
                                columnProps: {
                                    prop: "province",
                                    label: "省份",
                                },
                            },
                            {
                                columnProps: {
                                    prop: "city",
                                    label: "城市",
                                },
                            },
                            {
                                columnProps: {
                                    prop: "address",
                                    label: "地址",
                                },
                            },
                        ],
                    },
                    {   
                        slots: {
                            header:()=><el-input v-model={this.value} placeholder="请输入内容"/>,
                            default:({row})=>{
                                if(row.gender===1){
                                    return <el-button>报名</el-button>
                                }
                            }
                        },
                    },
                ],
            };
        },
        mounted() {
            const dataList = [];
            for (let i = 0; i < 10; i++) {
                dataList.push({
                    name: "张三",
                    gender: (i % 2) + 1,
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1518 弄",
                });
            }
            this.dataList = dataList;
            console.log(dataList, "dataList>>");
        },
        methods: {},
    };
</script>
```
:::


## 属性
|属性|类型|说明|默认值|
|--|--|--|--|
|data|array|传递给el-table的data|[]|
|columns|array|渲染字段配置|[]|
|tableProps|object|传递给el-table的参数|配置项`tableProps`|
|tableOn|object|传递给el-table的方法|配置项`tableOn`|
|tableHeight|number,string|el-table的默认高度|配置项`tableHeight`=0|
|className|string|根节点的class名|配置项`class.ITableRoot`|


## columns 配置
|属性|类型|说明|默认值|
|--|--|--|--|
|columnProps|object|传递给el-table-column的参数，具体参数查阅element-ui的文档|无|
|show|boolean,|是否显示当前列|true|
|render|jsx function|直接渲染dom，类似slots.default|无|
|slots|object|插槽内容|{}|
|children|array|多级表头的子表头配置|无|

## ref上的方法
|方法|说明|
|--|--|
|reDraw|手动重绘|


