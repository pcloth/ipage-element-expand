## 高级组件

### select-more 分页下拉选择器组件
:::tip
业务中常见的场景是当一个下拉框需要从接口获取，然后列表可能会很长的情况下，需要这种查询后可以分页的情况，分页将会出现在下拉的最底部
:::
:::demo 尝试一下，滚动到底。
```html
<template>
    <div>
        <p>尝试一下，滚动到底。</p>
        <RenderCell v-model="value" :item="item"/>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                item:{
                    slot:'select-more',
                    isFormItem:false,
                    placeholder:'请选择档案盒编号',
                    service: this.fetchDataList,
                }
            }
        },
        methods:{
            async fetchDataList(params){
                console.log(params,'params')
                // 以下只是模拟接口分页数据
                return new Promise((resolve)=>{
                    const records = []
                    const firstId = (params.pageNo-1)*params.pageSize
                    for(let i=0;i<params.pageSize;i++){
                        records.push({
                            label:`测试数据 - ${firstId+i}`,
                            value:`test${firstId+i}`,
                        })
                    }
                    setTimeout(()=>{
                        // 这里返回的数据格式按照ISearch的配置response.data
                        resolve({
                            data:{
                                total:40,
                                records
                            }
                        })
                    })
                })
            }
        }
    }
</script>
```
:::

#### 下拉选择器属性
:::tip
select-more组件是在element-ui的select组件的基础上封装的，下列属性中只列出了扩展的属性，原本element组件select的属性依然有效
:::
|属性|类型|说明|默认值|
|--|--|--|--|
|service|Function|下拉组件数据来源方法，分页参数由配置`search`控制，返回数据和total由`response`配置控制|必须填写，不然会出错|
|labelField|string|标签数据的key|'label'|
|valueField|string|value数据的key|'value'|
|keyField|string|循环dom的key|'id'|
|searchKey|string|搜索接口使用的字段|'keyword'|
|additionalParams|object|搜索额外传入的搜索参数|{}|
|labelFieldArr|array|显示多个label，显示的时候用-分割字段|[]|
|labelFunc|Function|用户自己控制label的显示内容|无|
|disabledFunc|Function|如何处理某个行禁止选中的方法|() => false|
|echoFunc|Function|当value有数据的时候，如何回显数据，请注意，这个接口只接收一个array|无|

#### 下拉选择器事件
|事件|说明|参数|
|--|--|--|
|getCurrentItem|change的时候，提交出来当前选中的item，而不是value，多选的时候是一个array，单选是一个object|currentItem|





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
