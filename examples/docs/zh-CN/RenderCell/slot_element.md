## 当前支持的全部的element-ui组件表
|slot值|element-ui组件|说明|
|--|--|--|
|link|el-link|Link 文字链接|
|input|el-input|Input 输入框|
|input-number|el-input-number|InputNumber 计数器|
|select|el-select|Select 选择器|
|radio|el-radio|Radio 单选框|
|radio-group|el-radio-group|Radio 单选框组|
|checkbox|el-checkbox|Checkbox 复选框|
|checkbox-group|el-checkbox-group|Checkbox 复选框组|
|date-picker|el-date-picker|DatePicker 日期选择器|
|time-picker|el-time-picker|TimePicker 时间选择器|
|switch|el-switch|Switch 开关|
|slider|el-slider|Slider 滑块|
|rate|el-rate|Rate 评分|
|color-picker|el-color-picker|ColorPicker 颜色选择器|
|cascader|el-cascader|Cascader 级联选择器|
|button|el-button|Button 按钮|
|popconfirm|el-popconfirm| Popconfirm 气泡确认框| 


### el-link 文字链接
:::demo [点击查看官方文档](https://element.eleme.cn/#/zh-CN/component/link)
```html
<template>
    <RenderCell :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                item:{
                    slot:'link',
                    tip:'link组件',
                    isFormItem:false,
                    props:{
                        type:'primary'
                    },
                    on:{
                        click:()=>{
                            alert('点击')
                        }
                    }
                }
            }
        }
    }
</script>
```
:::


### el-input 输入框
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/input" target="_blank">点击查看官方文档</a> `slots`可以设置插槽
```html
<template>
    <RenderCell v-model="value" :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                item:{
                    slot:'input',
                    tip:'这是一个输入框',
                    isFormItem:false,
                    props:{
                        type:'primary'
                    },
                    slots:{
                        prepend:()=><span>http://</span>
                    }
                }
            }
        }
    }
</script>
```
:::


### el-input-number 计数器
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/input-number" target="_blank">点击查看官方文档</a>
```html
<template>
    <RenderCell v-model="value" :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                item:{
                    slot:'input-number',
                    isFormItem:false,
                }
            }
        }
    }
</script>
```
:::



### el-select 选择器

`options`是选项数据，可以是array数组或者function方法（异步、同步方法都可以），它只在创建的时候生效一次，如果想要动态处理options，需要在父级销毁后再创建
它是一个方法时，一样会接收到`loadData`荷载参数
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/select" target="_blank">点击查看官方文档</a>
```html
<template>
    <div>
        <RenderCell v-model="value" :item="item"/>
        <RenderCell v-model="value2" :item="item2"/>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                value2:'',
                item:{
                    slot:'select',
                    isFormItem:false,
                    props:{
                        placeholder: '同步数据'
                    },
                    options:[
                        {
                            label:'测试',
                            value:'test'
                        }
                    ]
                },
                item2:{
                    slot:'select',
                    isFormItem:false,
                    props:{
                        placeholder: '异步数据'
                    },
                    options:()=>{
                        const options = [
                            {
                                label:'异步数据',
                                value:'test'
                            }
                        ]
                        return new Promise((resolve)=>{
                            setTimeout(()=>{
                                resolve(options)
                            },1000)
                        })
                    }
                }
            }
        }
    }
</script>
```
:::


### el-radio 单选框
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/radio" target="_blank">点击查看官方文档</a>
```html
<template>
    <RenderCell v-model="value" :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                item:{
                    slot:'radio',
                    tip:'单选框',
                    isFormItem:false,
                }
            }
        }
    }
</script>
```
:::


### el-radio-group 单选框组

`options`是选项数据，可以是array数组或者function方法（异步、同步方法都可以），它只在创建的时候生效一次，如果想要动态处理options，需要在父级销毁后再创建
它是一个方法时，一样会接收到`loadData`荷载参数
这里有一个额外参数`isButton`，将会指定为button形式
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/radio" target="_blank">点击查看官方文档</a>
```html
<template>
    <div class="demo-col-box">
        <RenderCell v-model="value" :item="item"/>
        <RenderCell v-model="value2" :item="item2"/>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                value:'test1',
                value2:'test2',
                item:{
                    slot:'radio-group',
                    isFormItem:false,
                    props:{
                        placeholder: '同步数据'
                    },
                    options:[
                        {
                            label:'同步数据1',
                            value:'test1'
                        },
                        {
                            label:'同步数据2',
                            value:'test2',
                            disabled:true
                        },
                        {
                            label:'同步数据3',
                            value:'test3'
                        }
                    ]
                },
                item2:{
                    slot:'radio-group',
                    isFormItem:false,
                    isButton:true,
                    props:{
                        placeholder: '异步数据'
                    },
                    options:()=>{
                        const options = [
                            {
                                label:'异步数据1',
                                value:'test1'
                            },
                            {
                                label:'异步数据2',
                                value:'test2'
                            }
                        ]
                        return new Promise((resolve)=>{
                            setTimeout(()=>{
                                resolve(options)
                            },1000)
                        })
                    }
                }
            }
        }
    }
</script>
```
:::


### el-checkbox 复选框
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/checkbox" target="_blank">点击查看官方文档</a>
```html
<template>
    <RenderCell v-model="value" :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                item:{
                    slot:'checkbox',
                    tip:'复选框',
                    isFormItem:false,
                }
            }
        }
    }
</script>
```
:::


### el-checkbox-group 复选框组

`options`是选项数据，可以是array数组或者function方法（异步、同步方法都可以），它只在创建的时候生效一次，如果想要动态处理options，需要在父级销毁后再创建
它是一个方法时，一样会接收到`loadData`荷载参数
这里有一个额外参数`isButton`，将会指定为button形式
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/checkbox" target="_blank">点击查看官方文档</a>
```html
<template>
    <div style="display:flex;flex-direction: column;height: 80px;justify-content: space-between;">
        <RenderCell v-model="value" :item="item"/>
        <RenderCell v-model="value2" :item="item2"/>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                value:['test1'],
                value2:['test2'],
                item:{
                    slot:'checkbox-group',
                    isFormItem:false,
                    props:{
                        placeholder: '同步数据'
                    },
                    options:[
                        {
                            label:'同步数据1',
                            value:'test1'
                        },
                        {
                            label:'同步数据2',
                            value:'test2',
                            disabled:true
                        },
                        {
                            label:'同步数据3',
                            value:'test3'
                        }
                    ]
                },
                item2:{
                    slot:'checkbox-group',
                    isFormItem:false,
                    isButton:true,
                    props:{
                        placeholder: '异步数据'
                    },
                    options:()=>{
                        const options = [
                            {
                                label:'异步数据1',
                                value:'test1'
                            },
                            {
                                label:'异步数据2',
                                value:'test2'
                            }
                        ]
                        return new Promise((resolve)=>{
                            setTimeout(()=>{
                                resolve(options)
                            },1000)
                        })
                    }
                }
            }
        }
    }
</script>
```
:::



### el-date-picker 日期选择器
请注意，props中涉及到短横线的key，如：`value-format`要写成`valueFormat`
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/date-picker" target="_blank">点击查看官方文档</a>
```html
<template>
    <RenderCell v-model="value" :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                value:'2021-01-01 07:00:05',
                item:{
                    slot:'date-picker',
                    isFormItem:false,
                    props:{
                        type:'datetime',
                        valueFormat:'YYYY-MM-DD HH:mm:ss'
                    }
                }
            }
        }
    }
</script>
```
:::


### el-time-picker 时间选择器
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/time-picker" target="_blank">点击查看官方文档</a>
```html
<template>
    <RenderCell v-model="value" :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                value:'07:00:05',
                item:{
                    slot:'time-picker',
                    isFormItem:false,
                    valueFormat:'HH:mm:ss'
                }
            }
        }
    }
</script>
```
:::

### el-switch 开关
:::demo <a href="https://element.eleme.cn/#/zh-CN/component/switch" target="_blank">点击查看官方文档</a>
```html
<template>
    <RenderCell v-model="value" :item="item"/>
</template>
<script>
    export default {
        data(){
            return {
                value:true,
                item:{
                    slot:'switch',
                    isFormItem:false,
                    props:{
                        'activeText':'按月付费',
                        'inactiveText':'按年付费'
                    }
                }
            }
        }
    }
</script>
```
:::


