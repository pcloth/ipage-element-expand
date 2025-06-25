### export 分页查询导出组件
:::tip
业务中，如果需要前端做表单导出，就可以使用这个组件，它会根据分页情况，获取全部的数据并导出成为excel文件。
导出组件在运行时，会先查询一次limit=1的请求，为了获取total数据，然后进行每页数据的获取
:::
:::demo 
```html
<template>
    <div>
        <p>尝试一下，点击导出。
            <p v-for="item,index in queryList" :key="index">第{{index+1}}次查询：{{item.count}}</p>
        </p>
        <RenderCell v-model="value" :item="item"/>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                value:'',
                queryList:[],
                item:{
                    slot:'export',
                    isFormItem:false,
                    props:{
                        splitCount:30,
                        queryApi: this.fetchDataList,
                        // 合并单元格，例如合并第一行的前两列
                        xlsxProps:{
                            // "!merges":[{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }],
                        },
                        columns:[
                            {
                                title:'项目',
                                key:'label'
                            },
                            {
                                title:'数值',
                                key:'value'
                            }
                        ],
                        beforeCreateExcel:(data,options)=>{
                            options.xlsxProps['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 1 } }]
                            console.log(data,options,'>>>>beforeCreateExcel')
                        }
                    },
                    on:{
                        clickExport:(loadData)=>{
                            this.queryList = []
                            console.log('clickExport',loadData)
                        }
                    }
                },

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
                    this.queryList.push({count:records.length})
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

#### export组件属性
|属性|类型|说明|默认值|
|--|--|--|--|
|columns|Array|Array<{title:string,key:string,width:number,formatter?:Function}>|[]，必须填写，不然导出表格是空的|
|columnWidth|Number|默认的列宽|10|
|exportButtonProps|Object|导出按钮的props，直接传递给el-button|{type: 'primary',size: 'mini',icon: 'el-icon-download',}|
|exportButtonText|String|导出按钮文本|导出|
|disabled|Boolean|是否禁用|false|
|fileName|String|导出文件名字|无，不填写的话，会用时间戳作为名字|
|useExternalData|Boolean|是否使用传入数据，而不是接口获取|false|
|excelData|Array|传入的数据，搭配`useExternalData`使用|[]|
|queryApi|Function|查询接口方法|无|
|queryInterval|Number|查询接口间隔毫秒数|1000|
|processQueryDataFunc|查询后可以用它来处理数据|无|
|specifyTotal|Number|手动指定total，如果有些接口是无法给total的，可以手动指定导出总数，设置>=0生效|-1|
|queryParams|Object|发送给queryApi的额外参数|{}|
|pageMode|String|分页模式，有page和limit两种|从配置`search.mode`上获取|
|pageSizeKey|String|分页尺寸的key|从配置`search.pageSize`上获取|
|pageNumberKey|String|分页数字的key|从配置`search.pageNo`上获取|
|offsetKey|String|当pageMode=limit时，偏移值的key|从配置`search.offset`上获取|
|limitKey|String|当pageMode=limit时，分页尺寸的key|从配置`search.limit`上获取|
|dataPath|String|从response上获取的数据路径，支持.分割|从配置`response.data`上获取|
|totalPath|String|从response上获取的total路径，支持.分割|从配置`response.total`上获取|
|splitCount|Number|分页查询，每页的数据量|100|
|splitFileCount|Number|每多少条分割一次文件|10000|
|fileMode|String|auto=根据splitFileCount分割文件，直接下载;zip=根据splitFileCount 分割文件，然后打包成zip；full=不分割文件，直接下载|auto|
|xlsxProps|Object|传递给底层xlsx库的参数，用来实现合并单元格等高级功能|无|
|beforeAction|Function|执行导出功能前的方法，会等待这个方法完成|无|
|beforeCreateExcel|Function、AsyncFunction|创建excel前的方法，会把整体的数据放出来，你也可以再这里修改options的内容，支持异步，你可以接到参数(data,options)，然后返回{data,options}，也可以不返回直接修改原生对象|无|
|customizeCreateExcel|Function|自定义导出功能，当需要特别复杂的表的时候，可以从这里拿到全部数据和参数，直接调用xlsx库完全自定义导出|无|
|delParamsEmpty|Boolean|是否删除查询空参数|true|




#### export组件事件
|事件|说明|参数|
|--|--|--|
|clickExport|点击导出按钮的时候触发|无|
|success|导出完成|无|
|error|导出错误|无|