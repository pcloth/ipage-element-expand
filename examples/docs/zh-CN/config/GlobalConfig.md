## 全局配置

推荐直接在项目合适的位置创建一个`expConfig.js`的文件，然后在`main.js`中引入即可

### expConfig.js
```js
import {config} from "ipage-element-expand"
config.set({
    // 您要配置的选项
})
export default config
```

### main.js
```js
import expConfig from "@/utils/expConfig"
```
