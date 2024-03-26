## 样式相关配置

### 基本用法 
```js
import {config} from "ipage-element-expand"

config.set({
    class:{
        // 查看下表中的配置项目
        IPageRoot:'mypage' // 例如修改IPage组件根节点class
    }
})
```



### class 配置
|配置项|类型|说明|默认值|
|--|--|--|--|
|IPageRoot|string|IPage组件根节点附加class|'ipage'|
|ISearchRoot|string|ISearch组件根节点附加class|'isearch'|
|ITableRoot|string|ITable组件根节点附加class|'itable'|
|IFormRoot|string|IForm组件根节点附加class：以这个优先|'iform'|
|IPageOperation|string|操作区额外的class|'ipage_operation'|
|tableWrap|string|表格外层的父元素class|'ipage_tableWrap'|
|IPagePagination|string|分页区额外的class|'ipage_pagination'|