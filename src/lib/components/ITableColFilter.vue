<template>
    <el-popover placement="bottom" width="200" trigger="hover">
        <div class="popoverTitle">
            <span>显示字段</span>
            <el-button type="primary" size="small" @click="submit">确定</el-button>
        </div>
        
        <el-tree style="margin-top:10px;" ref="tree" check-strictly node-key="value" @check="handleCheck" :default-checked-keys="currentValue" default-expand-all :data="columns" :props="defaultProps" show-checkbox >
        </el-tree>
        <i slot="reference" class="el-icon-setting"></i>
    </el-popover>
</template>
<script>
export default {
    props: {
        allItems: {
            type: Array,
            default: () => [],
        },
        /** 选中的项目 */
        value: {
            type: Array,
            default: () => [],
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label',
                value:'value'
            },
            currentValue: this.value,
            allKeys:[],
            columns:[]
        };
    },
    watch:{
        value:{
            handler(){
                this.currentValue = this.value
            },
            deep:true
        },
        currentValue:{
            handler(){
                this.$emit('input',this.currentValue)
            },
            deep:true
        }
    },
    methods:{
        getNodes(nodes){
            const columns = []
            const checkedList = []
            for(let i=0;i<nodes.length;i++){
                const item = nodes[i]
                if(item.isOperate){
                    continue
                }
                let show = true
                const value = item.columnProps.prop
                const label = item.columnProps.label
                if(typeof item.show==='boolean'){
                    show = item.show
                }
                if(show){
                    checkedList.push(value)
                }
                const newItem = {
                    label:label,
                    value:value,
                    checked:show,
                    children:[]
                }
                if(item.children){
                    const {columns:children,checkedList:childrenCheckedList} = this.getNodes(item.children)
                    newItem.children.push(...children)
                    checkedList.push(...childrenCheckedList)
                }
                columns.push(newItem)
            }
            return {columns,checkedList}
        },
        handleCheck(){
            const arr = this.$refs.tree.getCheckedKeys()
            this.currentValue = arr
        },
        submit(){
            this.$emit('changeFilter',this.currentValue)
        }
    },
    mounted(){
        const {columns,checkedList} = this.getNodes(this.allItems)
        this.columns = columns
        this.currentValue = checkedList
    },
};
</script>

<style scoped>
.popoverTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    /* margin-bottom: 20px; */
}
</style>