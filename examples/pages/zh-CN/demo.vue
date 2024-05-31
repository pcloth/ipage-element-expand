<template>
    <div>
        <p>测试页面</p>
        <el-button @click="hideCol">测试隐藏</el-button>
        <IPage v-bind="ipageProps" :columns="TableColumns"></IPage>
        <!-- <ITable v-if="showTable" ref="IPage" tableHeight="400px" :data="data" :columns="TableColumns"></ITable> -->
        <el-table :data="data" style="margin-top:20px;">
            <el-table-column v-if="showColFlag" prop="test6" label="不嵌套6">
            </el-table-column>
            <el-table-column prop="test1" label="test1">
                <el-table-column prop="test1" label="test1">
                </el-table-column>
                <el-table-column prop="test2" label="test2">
                </el-table-column>
                <el-table-column prop="test3" label="test3">
                </el-table-column>
            </el-table-column>
            <el-table-column prop="test4" label="不嵌套4">
            </el-table-column>
            <el-table-column prop="test5" label="不嵌套5">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { TableColumns } from "./demo";
export default {
    data() {
        return {
            count:1,
            TableColumns,
            showColFlag:true,
            showTable:true,
            data: [
                {
                    test1: "test1",
                    test2: "test2",
                    test3: "test3",
                    test4: "test4",
                    test5: "test5",
                    test6: "test6",
                },
            ],
            ipageProps:{
                searchProps:{
                    queryFunc:async (params)=>{
                        console.log(params, "params");
                        const data = []
                        for(let i=0;i<this.count*10;i++){
                            data.push({
                                test1: "test1-"+i,
                                test2: "test2-"+i,
                                test3: "test3-"+i,
                                test4: "test4-"+i,
                                test5: "test5-"+i,
                                test6: "test6-"+i,
                            })
                        }
                        return {
                            data:{
                                records:data,
                                total:this.count*10
                            },
                            
                        }

                    }
                },

            }
        };
    },
    computed:{
        // TableColumns(){
        //     const columns = [...TableColumns]
        //     columns[0].children[1].show = ()=>{
        //         return this.showColFlag
        //     }
        //     return columns
        // }
    },
    methods: {
        hideCol() {
            this.showColFlag = false
            this.TableColumns[0].children[1].show = false
            // this.TableColumns[0].show = false;
            // this.$refs.IPage.$refs.table.doLayout();
            // console.log(this.TableColumns, "this.TableColumns");
            // this.TableColumns[1].show = false
            // this.$set(this.TableColumns[0], 'show',false)
            // this.$set(this.TableColumns[0].children[1],'show',false)
            // this.showTable = false
            // setTimeout(()=>{
            //     this.showTable = true
            // },0)
            // this.$refs.IPage.$forceUpdate()
        },
    },
};
</script>

<style>
</style>