export const TableColumns = [
    {   id:1,
        columnProps:{
            label:'合并表头',
            prop:'test1',
        },
        show:true,
        children:[
            {
                id:2,
                columnProps:{
                    label:'测试分类2',
                    prop:'test2',
                }
            },
            {
                id:3,
                columnProps:{
                    prop:'test3',
                    renderHeader:(h)=><span>嵌套隐藏3</span>,
                },
                show:(loadData)=>{
                    console.log(loadData,'canshow')
                    // return this.showColFlag
                    return true
                },
            },
            {
                id:6,
                columnProps:{
                    label:'测试分类6',
                    prop:'test6',
                }
            },
        ]
    },
    {
        id:4,
        columnProps:{
            label:'不嵌套隐藏',
            prop:'test4',
        },
        show:true
    },
    // {
    //     id:5,
    //     columnProps:{
    //         label:'不嵌套',
    //         prop:'test5',
    //     },
    //     show:true
    // }
]