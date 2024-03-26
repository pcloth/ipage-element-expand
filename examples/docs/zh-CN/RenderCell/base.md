### 基本用法

这是整个系列的核心组件，它负责将js和json数据渲染成element-ui的一些组件

#### 基础渲染、传参和事件
:::demo 现在演示了一个独立存在的el-input组件的渲染
```html
<template>
    <div>
        <RenderCell v-model="name" :item="item"/>
    </div>
    
</template>
<script>
    export default {
        data(){
            return {
                name:'',
                item:{
                    id:'name',
                    slot:'input',
                    isFormItem:false,
                    props:{
                        placeholder:"请输入姓名"
                    },
                    on:{
                        input:(value,loadData)=>{
                            console.log('input',value,loadData)
                        }
                    }
                }
            }
        }
    }
</script>
```
:::

#### 知识点

1. `on`对象将接收封装组件`el-input`的事件，并在原始参数的后方叠加loadData荷载数据，你按下F12，并观察上面的输入框的input事件传参，可以看到荷载的数据
2. `props`将传递给封装组件`el-input`，如果props里面有方法，比如传递给el-upload组件的，RenderCell渲染单元也将把`loadData`荷载数据叠加到事件中emit出来
