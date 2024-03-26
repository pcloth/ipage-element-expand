<template>
    <div>
        <IPage :columns="columns" :searchItems="searchItems" v-bind="otherProps" :formItems="formItems" :formRules="formRules"></IPage>
    </div>
</template>
<script lang="jsx">

export default {
    data() {
        return {
            searchItems:[
                // 姓名，性别，最小成绩
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
