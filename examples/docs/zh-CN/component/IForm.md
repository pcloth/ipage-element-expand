## 表单组件

:::tip
表单组件和ISearch很类似，都是对el-form的封装
:::
### 基本用法


:::demo 搜索组件是一个对el-form表单的封装，所有的输入单元和按钮都是`RenderCell`组件
```html
<template>
    <IForm 
    :gutter="30"
        v-model="formData" 
        :formItems="formItems" 
        :formRules="formRules"
        :queryFunc="queryFunc"
        @searchSuccess="searchSuccess"
    />
</template>
<script>
    export default {
        data(){
            return {
                formData:{
                    gender:1,
                },
                results:{},
                formItems:[
                    {
                        id:'name',
                        label:'姓名',
                        span:24,
                        props:{
                            placeholder:"请输入姓名"
                        },
                    },
                    {
                        id:'gender',
                        label:'性别',
                        slot:'select',
                        span:24,
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
                                label:'中性',
                                value:3,
                                disabled:true
                            }
                        ]
                    },
                ],
                formRules:{
                    name:{ required: true, message: '请输入姓名', trigger: 'blur' },
                    gender:{ required: true, message: '请选择性别', trigger: 'blur' },
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
            searchSuccess(resp){
                console.log(resp,resp)
                this.results = JSON.stringify(resp)
            }
        }
    }
</script>
```
:::


## 属性

|属性|类型|说明|默认值|
|--|--|--|--|
|value|object|表单v-model|{}|
|formClass|string|表单根节点的class|配置项`class.IFormRoot`|
|formProps|object|传递给el-form的props参数|配置项`formProps`|
|formOn|object|传递给el-form的事件|配置项`formOn`|
|formRules|object|表单校验规则，直接传递给el-form组件|{}|
|gutter|number|el-row组件的gutter，用来分割每个组件的间距|配置项`gutter`，默认没有配置|
|expandButtons|array|扩展按钮的`RenderCell`组件配置|[]|
|submitButton|object,boolean|false=不显示提交按钮，object=显示并控制提交按钮的`RenderCell`组件配置|配置项`submitButton`|
|cancelButton|object,boolean|false=不显示取消按钮，object=显示并控制取消按钮的`RenderCell`组件配置|配置项`cancelButton`|
|formItems|array|表单项目列表，每个子项都是一个`RenderCell`组件配置|[]|
|qData|object|附加给每个渲染单元的qData参数，方便制作一些高阶操作|{}|
|submitPreventRepeat|boolean|调用submitFunc时是否节流|false|
|submitFunc|function|提交方法|null|
|loading|boolean|外部控制的loading|false|
|className|string|组件根节点的class类名，方便控制整体样式|配置项`class.ISearchRoot`|


## formItems 配置

:::tip
除了以下独特的参数，其他参数都和`RenderCell`渲染单元配置一样
:::

|属性|类型|说明|默认值|
|--|--|--|--|
|span|number|表单单元外部的el-col组件参数|24|

## 事件
|事件|说明|参数|
|--|--|--|
|changeForm|表单内容发生变动|formValue,item|
|beforeSubmit|表单校验通过，提交前|formValue|
|afterSubmit|表单提交成功后|response|
|validationFailed|表单校验失败|formValue|
|cancel|点击取消按钮后|formValue|
