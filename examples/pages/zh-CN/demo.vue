<template>
    <div>
        <p>测试页面</p>
        <ITable tableHeight="400px" :data="data" :columns="TableColumns"></ITable>
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
                }
            ]
        }
    }
}
</script>

<style>

</style>