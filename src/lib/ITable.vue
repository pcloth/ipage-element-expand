
<script lang="jsx">
import {toEventsAppendParamsDeep} from "./utils"
import {config as $c} from './config';
export default {
    name: "ITable",
    components:{
        RenderCell:()=>import('./components/RenderCell'),
        ITableColumn:()=>import('./components/ITableColumn')
    },
    props:{
        // 数据表
        data:{
            type:Array,
            default:()=>[]
        },
        // 渲染表参数
        columns:{
            type:Array,
            default:()=>[]
        },
        tableProps:{
            type:Object,
            default:()=>$c.get('tableProps')
        },
        tableSlots:{
            type:Object,
            default:()=>({})
        },
        tableOn:{
            type:Object,
            default:()=>$c.get('tableOn')
        },
        tableHeight:{
            type:[Number,String],
            default:()=>$c.get('tableHeight')
        },
        className:{
            type:String,
            default:()=>$c.get('class').ITableRoot
        }
    },
    data(){
        return {
            // height:'400px'
        }
    },
    mounted(){

    },
    computed:{
        tableEvent(){
            const loadData = {
                data: this.data,
                allItems: this.columns,
                $table:this,
            }
            return toEventsAppendParamsDeep(this.tableOn||{},loadData,this)
        }
    },
    methods:{
        doLayout(){
            if (this.$refs.table && this.$refs.table.doLayout) {
                this.$refs.table.doLayout();
            }
        },
        reSize(){
            // this.height = `${this.tableHeight}px`
            this.$nextTick(()=>{
                this.doLayout()
            })
        },
        checkCanShow(item){
            const loadData = {
                item: item,
                allItems: this.columns,
                $column:this
            };
            let canShow = true;
            const {show} = item
            if(show!==undefined){
                if(typeof show==='boolean'){
                    canShow = item.show
                }else if(show.constructor.name === 'Function'){
                    canShow = item.show(loadData)
                }else if(show.constructor.name === 'Boolean'){
                    canShow = item.show
                }else {
                    throw new Error('show参数必须是方法或者布尔值')
                }
            }
            return canShow
        },
    },
    render(){
        const columnDoms = []
        const children = this.columns||[];
        children.forEach(item=>{
            const canShowChild = this.checkCanShow(item)
            if(canShowChild){
                columnDoms.push(<ITableColumn item={item} columns={this.columns}></ITableColumn>)
            }
        })
        // console.log(columnDoms,'columnDoms 父节点')
        return (
            <el-table ref="table" class={this.className} data={this.data} props={{height:this.tableHeight,...this.tableProps}} on={this.tableEvent}>
                {columnDoms}
            </el-table>
        )
    }
}
</script>

<style>
</style>