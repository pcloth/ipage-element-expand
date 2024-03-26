## RenderCell 属性

|属性|类型|说明|默认值|
|--|--|--|--|
|value|[String, Number, Array, Object, Boolean,Date]|v-model数据|`undefined`|
|item|object|渲染组件内容数据，下方有详细说明|`undefined`|
|defaultSlot|string|`item`对象中如果没有`slot`值，将使用defaultSlot|`undefined`|
|defaultProp|object|`item`对象中如果没有`props`defaultProp|`undefined`|
|allItems|array|兄弟RenderCell数据集，传递给荷载数据`loadData`|`undefined`|
|formData|object|父级表单model数据，传递给荷载数据`loadData`|`undefined`|
|qData|Object|父级附加数据，传递给荷载数据`loadData`|`undefined`|


## item 属性
|属性|类型|说明|默认值|
|--|--|--|--|
|id|string|表单组件v-model的对象key，循环渲染时候的key|如果不传入，将随机生成一个uuid|
|label|string|当isFormItem=true时候，表单标签|`undefined`|
|width|string|控制组件的style.width|`undefined`|
|tip|string|input的placeholder，span、button、link、checkbox的默认插槽|`undefined`|
|slot|string|需要渲染的element-ui组件类型，默认去掉el字符，比如el-input，写为`input`|`undefined`|
|options|[array,function,async function]|select、radio-group、checkbox-group子组件的options（TODO：这里需要调整）|[]|
|directives|array|自定义指令数据|[]|
|debounce|boolen,number|v-model是否需要额外的防抖，当`slot="time-picker"`时自动赋予|`undefined`|
|slots|object|用于组件的插槽|{}|
|props|object|传递给原生组件的props，如果其中有function类型，会自动添加loadData数据|{}|
|on|object|传递给原生组件的on,用于接收组件的emit事件，会自动添加loadData数据|{}|
|show|boolen|是否显示本组件，类似v-show|true|
|canShowFunc|function|等同于show，接收参数loadData|`undefined`|
|formItemProps|object|如果isFormItem=true的时候，父级el-form-item组件的props参数|{}|
|isFormItem|boolen|是否在父级添加el-form-item组件|true|
|...rest|any|其他属性，将传递给实际的组件|{}|


## loadData 荷载数据
传递给组件方法的有如下数据：`item`、`data`、`qData`、`allItems`、`$rcell`
1. `item`为自生接收到的props.item
2. `data`为props.formData
3. `qData`为props.qData
4. `allItems`为props.allItems
5. `$rcell`为组件的this



