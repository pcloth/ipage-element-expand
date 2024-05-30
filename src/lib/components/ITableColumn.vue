<script lang="jsx">
import { TableColumn } from 'element-ui';
import ITableColumn from "./ITableColumn.vue"
import {
    isVNode,
    isRenderCell,
    _toEventsAppendParams_,
} from "../utils";
const defaultColumnProps = {
    showOverflowTooltip:true
}
export default {
    name:'ITableColumn',
    components: { 
        TableColumn,
        ITableColumn,
        RenderCell:()=>import('./RenderCell'), 
    },
    props:{
        item:{
            type:Object,
            default:()=>({})
        },
        columns:{
            type:Array,
            default:()=>[]
        },
    },
    data(){
        return {

        }
    },
    watch:{

    },
    computed:{
        columnProps(){
            return (item)=>{
                let props = {
                    ...defaultColumnProps,
                    ...item.columnProps||{}
                }
                return props
            }
        }
    },
    async mounted(){
        // this.canShow = await this.checkCanShow(this.item)
    },
    methods:{
        // 包装传入格式化
        formatter(row, column, cellValue, index){ 
            if(this.item.formatter){
                const loadData = {
                    data: row,
                    allItems: this.columns,
                    $column:this,
                };
                return this.item.columnProps?.formatter(row, column, cellValue, index, loadData)
            }
            return cellValue;
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
        const canShow = this.checkCanShow(this.item)
        if(!canShow){
            return null
        }
        const scopedSlots = this.item.slots?this.item.slots:{}
        const loadData = {
                item: this.item,
                allItems: this.columns,
                $column:this,
                h:this.$createElement
            };
        const makeNode = (ff,key)=>{
            console.log(ff,typeof ff,'>>>>');
            if(typeof ff==='function'){
                return _toEventsAppendParams_(ff,key,loadData,this)
            }else if(isVNode(ff)){
                // vNode对象
                return ()=>ff
            }else if(isRenderCell(ff)){
                if(ff.render && typeof ff.render==='function'){
                    return ff.render
                }
                // cell组件数据
                return ()=>{
                    return <RenderCell isFormItem={false} item={ff}></RenderCell> 
                } 
            }else if(ff && ff.render && isVNode(ff.render)){
                    return ()=>ff.render
            } else{
                return null
                // throw "scopedSlots参数只支持三种类型：cell参数、函数、vNode对象"
            }
        }
        
        if(this.item.cell){
            scopedSlots.default = (scope)=>{
                return <RenderCell isFormItem={false} qData={{...scope}} item={this.item.cell}></RenderCell> 
            }
        }else if(this.item.render){
            scopedSlots.default = _toEventsAppendParams_(this.item.render,'render',loadData,this)
        }
        const columnDoms = []
        const children = this.item.children||[];
        children.forEach(item=>{
            const canShowChild = this.checkCanShow(item)
            if(canShowChild){
                columnDoms.push(<ITableColumn item={item} columns={children}></ITableColumn>)
            }
        })
        if(this.item.id===3){
            // debug
            window.tt = this
        }
        // console.log(columnDoms,'columnDoms')
        return <TableColumn ref="TableColumn" scopedSlots={scopedSlots} formatter={this.formatter} props={this.columnProps(this.item)}>
            {
                columnDoms
            }
        </TableColumn>
    }
}
</script>

<style></style>
