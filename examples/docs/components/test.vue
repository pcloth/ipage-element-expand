<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules">
            <IPage :searchItems="searchItems"></IPage>
        </el-form>
    </div>
</template>
<script>
    export default {
        props:{
            searchItems:{
                type:Array,
                default:()=>[]
            }
        },
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
                            placeholder:"请输入姓名",
                            clearable:true
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
                            change:(value,loadData)=>{

                                console.log(value,loadData,'gender change')
                                loadData.data.suject = null
                                loadData.data.gender = null
                                this.$set(loadData.allItems[2],'show',false)
                                this.$nextTick(()=>{
                                    loadData.data.gender = value
                                    this.$set(loadData.allItems[2],'show',true)
                                })

                            }
                        }
                    },
                    {
                        id:'suject',
                        slot:'select',
                        label:'科目',
                        canShowFunc:({data})=>{
                            console.log('canshow',data.gender?true:false)
                            return data.gender?true:false
                        },
                        created:($me)=>{
                            const {formData} = $me
                            console.log($me,'>>>created',formData.gender)
                            if(formData.gender==='1'){
                                $me.item.options = [
                                    {
                                        label:'1000米',
                                        value:'20001'
                                    }
                                ]
                            }else if(formData.gender==='2'){
                                $me.item.options = [
                                    {
                                        label:'800米',
                                        value:'20002'
                                    }
                                ]
                            }else{
                                $me.item.options = []
                            }
                            
                        },
                        options:[],
                    },
                    {
                        id:'submit',
                        slot:'button',
                        tip:'提交',
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