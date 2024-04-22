### render 渲染函数
:::demo 允许接收一个渲染函数，用来直接渲染内容
```html
<template>
    <RenderCell :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                item:{
                    slot:'render',
                    isFormItem:false,
                    render:(loadData)=>{
                        console.log(loadData,'loadData')
                        return <span>这是一个自定义渲染</span>
                    }
                }
            }
        }
    }
</script>
```
:::