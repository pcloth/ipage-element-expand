## IPage 相关全局配置


### response 配置
response是关于isearch查询请求后，如何处理返回信息的相关配置
```js
config.set({
    response:{
        // 下表中的配置项
        data: 'data.records'
    }
})
```
|配置项|类型|说明|默认值|
|--|--|--|--|
|data|string|ITable需要的data数据|'data.records'|
|total|string|分页组件需要的total数据|'data.total'|
|beforeFunc|Function,null|自定义返回值处理函数，函数返回值必须是一个对象，包含两个属性：`data`,`total`|null|


### search 搜索分页相关参数
```js
config.set({
    search:{
        // 下表中的配置项
        mode:'offset'
    }
})
```
|配置项|类型|说明|默认值|
|--|--|--|--|
|mode|string|分页模式：page=页码模式，offset=偏移模式|'page'|
|pageSize|string|页码模式参数：分页尺寸|'pageSize'|
|pageNo|string|页码模式参数：页码|'pageNo'|
|limit|string|偏移模式参数：分页尺寸|'limit'|
|offset|string|偏移模式参数：(pageNo-1)*pageSize|'offset'|
|beforeFunc|Function,null|func(params)自定义查询前处理函数，函数返回值必须是一个对象，是给分页查询接口的分页参数。|null|

### ITable 配置
```js
config.set({
    // 下表中的配置项
    tableHeightMode:'data',
    dialogProps:{
        width: '50%',
        top:'3vh'
    }
})
```
|配置项|类型|说明|默认值|
|--|--|--|--|
|tableHeightMode|string|表格高度锁：仅在IPage组件中的ITable生效；parent=会自动撑满<父组件>，有滚动条;data=会显示全部数据撑开页面，不会有滚动条|'parent'|
|columnButtonProps|object|ITable 组件的默认传入数据，用来渲染表格操作栏，其中columnProps是传递给el-table-column组件的参数|{columnProps: {label: '操作',minWidth: 140,fixed: 'right',},}|


### el-pagination 组件配置
```js
config.set({
    paginationProps:{
        layout:"total, sizes, prev, pager, next, jumper"
    }
})
```
|配置项|类型|说明|默认值|
|--|--|--|--|
|tableHeightMode|string|表格高度锁：仅在IPage组件中的ITable生效；parent=会自动撑满<父组件>，有滚动条;data=会显示全部数据撑开页面，不会有滚动条|'parent'|
|paginationProps|object|传递给el-pagination分页组件的参数|{layout:"total, sizes, prev, pager, next, jumper"}|



### el-dialog 新增、修改弹窗配置
```js
config.set({
    // 下表中的配置项
    dialogProps:{
        width: '50%',
        top:'3vh'
    }
})
```
|配置项|类型|说明|默认值|
|--|--|--|--|
|dialogProps|object|弹窗默认的属性，将直接传递给IPage使用的增改数据el-dialog组件使用|{width: '50%',appendToBody: true}|
|dialogOn|object|弹窗默认的事件，将直接传递给IPage使用的增改数据el-dialog中|{}|

### toolbarButton 工具条按钮默认配置
```js
config.set({
    /** 默认toolbar上的RenderCell组件数据 */
    toolbarButton:{
        slot:'button',
        props:{
            size:'small',
            type:'text',
        }
    }
})
```

### button 默认表格操作区按钮配置
```js
config.set({
    /** 默认columnButtons里的RenderCell组件数据 */
    button:{
        slot: 'button',
        props: {
            size: 'small',
            type: 'text',
        },
    }
})
```

### editButton修改、deleteButton删除两个按钮的默认配置
它们两个按钮会先继承`button 默认表格操作区按钮配置`这个配置，然后再叠加自己各自的配置
```js
config.set({
    /** 默认columnButtons里的RenderCell组件数据 */
    editButton:{
        id: 'edit',
        tip: '编辑',
        /** 下面这部分会从button上继承
        slot: 'button',
        props: {
            size: 'small',
            type: 'text',
        },
        */
    },

    // 设置为false表示不需要这个按钮和功能
    deleteButton:false,
})
```
|配置项|类型|说明|默认值|
|--|--|--|--|
|editButton|object|bool=false|新增按钮的RenderCell组件数据，如果不需要编辑按钮，可以设置为false|-默认编辑-|
|deleteButton|object|bool=false|删除按钮的RenderCell组件数据，如果不需要删除按钮，可以设置为false|-默认删除-|


### addButton 新增按钮配置
用法如同editButton和deleteButton，不同之处在于addButton所在的位置是`toolbar`

