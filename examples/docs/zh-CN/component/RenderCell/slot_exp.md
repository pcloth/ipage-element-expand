### extendedRenderCell 全局扩展配置
当你在`全局配置`中，声明了新的组件，就可以直接在`item`参数中使用了

#### 例如：
```js
import test from './docs/components/test.vue'
config.set({
    extendedRenderCell:{
        /** 注意，这里的h渲染函数必须接收这个参数，否则会报错 */
        demo:(h)=><el-button>demo</el-button>,
    }
})
```

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
                    slot:'demo',
                    isFormItem:false,
                },
            }
        }
    }
</script>
```
:::
