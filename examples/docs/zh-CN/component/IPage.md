## 介绍

这是一个集成了增删改查的一个标准页面封装，为了更快速的交付业务。

:::demo 搜索组件是一个对el-form表单的封装，所有的输入单元和按钮都是`RenderCell`组件
```html
<template>
    <IPage 
        v-bind="ipageProps" 
    />
</template>
<script>
    export default {
        data(){
            return {
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