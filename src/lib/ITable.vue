
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
    },
    render(){
        return (
            <el-table ref="table" class={this.className} data={this.data} props={{height:this.tableHeight,...this.tableProps}} on={this.tableEvent}>
                {this.columns.map(item=>{
                        return <ITableColumn item={item} columns={this.columns}></ITableColumn>
                    })}
            </el-table>
        )
    }
}
</script>

<style>
</style>