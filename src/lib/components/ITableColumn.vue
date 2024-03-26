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
            canShow:true,
        }
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
        await this.checkCanShow()
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
        async checkCanShow(){
            const item = this.item
            const loadData = {
                item: item,
                allItems: this.columns,
                $column:this
            };
            let show = true;
            if(typeof item.show==='boolean'){
                show = item.show
            }
            if(item.show){
                if(item.show.constructor.name === 'Function'){
                    const nv = item.show(loadData)
                    if(nv.constructor.name === 'Promise'){
                        show = await nv
                    }else{
                        show = nv
                    }
                }else if(item.show.constructor.name === 'Promise'){
                    show = await item.show(loadData)
                }else if(item.show.constructor.name === 'Boolean'){
                    show = item.show
                }else {
                    throw new Error('show参数必须是方法或者布尔值')
                }
            }
            this.canShow = show
            return show
        },
    },
    render(){
        if(!this.canShow){
            return null
        }
        const scopedSlots = this.item.slots?this.item.slots:{}
        const loadData = {
                item: this.item,
                allItems: this.columns,
                $column:this,
            };
        const makeNode = (ff,key)=>{
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
            }else if(isVNode(ff.render)){
                    return ()=>ff.render
            } else{
                throw "scopedSlots参数只支持三种类型：cell参数、函数、vNode对象"
            }
        }
        Object.keys(scopedSlots).forEach(key=>{
            scopedSlots[key] = makeNode(scopedSlots[key],key)
        })
        
        if(this.item.cell){
            scopedSlots.default = (scope)=>{
                return <RenderCell isFormItem={false} qData={{...scope}} item={this.item.cell}></RenderCell> 
            }
        }else if(this.item.render){
            scopedSlots.default = _toEventsAppendParams_(this.item.render,'render',loadData,this)
        }

        return <TableColumn scopedSlots={scopedSlots} formatter={this.formatter} props={this.columnProps(this.item)}>
            {
                this.item.children && this.item.children.length>0?
                this.item.children.map(item=>{
                    return <ITableColumn item={item} columns={this.columns}></ITableColumn>
                }):null
            }
        </TableColumn>
    }
}
</script>

<style></style>
