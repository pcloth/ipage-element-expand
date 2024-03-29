## 在表单中使用

这是整个系列的核心组件，它负责将js和json数据渲染成element-ui的一些组件

### 基础渲染、传参和事件
:::demo 尝试一下选择性别
```html
<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules">
            <template v-for="item in allItems">
            <RenderCell v-model="form[item.id]" :item="item" :formData="form" :allItems="allItems"/>
            </template>
        </el-form>
    </div>
    
</template>
<script>
    export default {
        data(){
            return {
                form:{
                    name:'',
                    gender:'',
                    suject:null,
                },
                showsuject:false,
                rules:{
                    name:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ]
                },
                allItems:[
                    {
                        id:'name',
                        slot:'input',
                        label:'姓名',
                        isFormItem:true,
                        props:{
                            placeholder:"请输入姓名"
                        },
                        on:{
                            input:(value,loadData)=>{
                                console.log('input',value,loadData)
                            }
                        }
                    },
                    {
                        id:'gender',
                        slot:'select',
                        label:'性别',
                        props:{
                            clearable:true
                        },
                        options:[
                            {
                                label:'男',
                                value:'1'
                            },
                            {
                                label:'女',
                                value:'2'
                            }
                        ],
                        on:{
                            change:(value,{data,allItems})=>{
                                console.log(value,data,'gender change')
                                let show = true;
                                if(value==='1'){
                                    data.suject = '20001'
                                }else if(value==='2'){
                                    data.suject = '20002'
                                }else{
                                    show = false
                                    data.suject = null
                                }
                                this.$set(allItems[2],'show',show)
                            }
                        }
                    },
                    {
                        id:'suject',
                        slot:'select',
                        label:'科目',
                        show:false,
                        props:{
                            disabled:true
                        },
                        options:[
                            {
                                label:'1000米',
                                value:'20001'
                            },
                            {
                                label:'800米',
                                value:'20002'
                            }
                        ]
                    },
                    {
                        id:'submit',
                        slot:'button',
                        tip:'提交',
                        show:true,
                        props:{
                            type:'primary'
                        },
                        on:{
                            click:(e,loadData)=>{
                                console.log('click',e,loadData)
                                this.$refs.form.validate()
                            }
                        }
                    }
                ]
            }
        }
    }
</script>
```
:::

### 知识点
1. `isFormItem=true`之后，会给组件外层包裹一个`el-form-item`组件
2. `id`字段将会作为el-form-item组件的prop传入，并和rules联动起来
3. `slot`字段将会指定渲染组件的类型
4. `tip`字段将会放到一些组件的`default`插槽里(button,span等)
5. `formData`参数会添加到事件返回的荷载`loadData.data`，这意味着您可以在某个组件参数item.on的事件中，直接修改其他组件的value
6. `show`字段将会控制组件的显示与否，等同于v-show
