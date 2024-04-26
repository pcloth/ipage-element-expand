export const TableColumns = [
    {   id:1,
        columnProps:{
            label:'合并表头',
            prop:'test1',
            // renderHeader:(h)=><span>111</span>
        },
        children:[
            {
                id:2,
                columnProps:{
                    label:'测试分类1',
                    prop:'test1',
                    // renderHeader:(h)=><span>222</span>
                }
            },
            {
                id:3,
                columnProps:{
                    label:'测试分类2',
                    prop:'test2',
                    renderHeader:(h)=><span>测试分类2</span>,
                },
                show:(loadData)=>{
                    // console.log(loadData,'loadData,show')
                    return false
                },
                render:(_,{h})=>{
                    // console.log(_,'>>>>',h)
                    return <span>8888</span>
                }
            },
            {
                id:6,
                columnProps:{
                    label:'测试分类6',
                    prop:'test1',
                    // renderHeader:(h)=><span>222</span>
                }
            },
        ]
    },
    {
        id:4,
        columnProps:{
            label:'测试分类3',
            prop:'test3',
        },
        show:true
    }
]