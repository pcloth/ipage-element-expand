<template>
    <div>
        <p>测试页面</p>
        <el-button @click="hideCol">测试隐藏</el-button>
        <ITable ref="IPage" tableHeight="400px" :data="data" :columns="TableColumns"></ITable>
    </div>
</template>

<script>
import {TableColumns} from "./demo"
export default {
    data(){
        return {
            TableColumns,
            data:[
                {
                    test1:'test1',
                    test2:'test2',
                    test3:'test3',
                    test4:'test4',
                    test5:'test5',
                    test6:'test6',
                }
            ]
        }
    },
    methods:{
        hideCol(){
            // this.TableColumns[0].children[1].show = false
            this.TableColumns[0].show = false;
            this.$refs.IPage.$refs.table.doLayout()
            console.log(this.TableColumns,'this.TableColumns')
            // this.TableColumns[1].show = false
            // this.$set(this.TableColumns[1],'show',false)
        }
    }
}
</script>

<style>

</style>