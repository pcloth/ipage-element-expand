<script lang="jsx">
/**
 * @Description: 渲染单元格
 */
import {
    getPathValue,
    toEventsAppendParams,
    toEventsAppendParamsDeep,
    uuid,
    preventRepeat as debounceFn,
    isVNode,
    isRenderCell,
    deepAssign
} from "../utils";
import {config as $c} from '../config';


import Renderer from "./Renderer.vue";
import RenderCell from "./RenderCell.vue";
import RSelectLoadMore from "./RenderSelectLoadmore"
import SplitDownloadAndExport from "./SplitDownloadAndExport"

const cellProps = {
    value: {
        type: [String, Number, Array, Object, Boolean,Date]
    },
    item: {
        type: Object
    },
    allItems: {
        type: Array
    },
    formData: {
        type: Object,
        default(){
            return {}
        }
    },
    isFormItem: {
        type: Boolean,
        default: true
    },
    qData: {
        type: Object
    },
    defaultSlot: {
        type: String
    },
    defaultProp:{
        type:Object,
        default(){
            return {}
        }
    }
};

/** 创建防抖update方法 */
const createDebounceUpdateValue = (id, that, timeout = 100,inputFunc) => {
    return debounceFn(val => {
        that.currentValue = val;
        if(inputFunc){
            inputFunc(val)
        }
    }, timeout);
};

export default {
    components:{RenderCell,RSelectLoadMore},
    name: "RenderCell",
    props: cellProps,
    data(){
        return {
            currentValue:this.value
        }
    },
    async created(){
        this.currentValue = this.value
        // 接受传入的created方法
        if(this.item.created && typeof this.item.created === 'function'){
            await this.item.created(this)
            this.$forceUpdate()
        }
    },
    watch:{
        value(v){
            this.currentValue = v
        },
        currentValue(v){
            this.$emit('input',v)
        },
    },
    methods:{
        checkDomData(dom){
            if(!dom.componentOptions){
                dom.componentOptions = {}
            }
            // propsData
            if(!dom.componentOptions.propsData){
                dom.componentOptions.propsData = {}
            }
            // listeners
            if(!dom.componentOptions.listeners){
                dom.componentOptions.listeners = {}
            }
            if(!dom.data){
                dom.data = {}
            }
        },
        handleStyle(dom){
            let style = {}
            if(dom){
                if(!dom.data){
                    dom.data = {}
                }
                if(!dom.data.attrs){
                    dom.data.attrs = {}
                }
                if(!dom.data.attrs.style){
                    dom.data.attrs.style = style
                }
                style = {...dom.data.attrs.style}
            }
            
            style = {...style,width:this._props.item.width}
            if(dom){
                dom.data.attrs.style = style
            }
            return style
        },
    },
    render(h){
        /** 初始化插槽 */
        const initSlots = (slots, cellProps) => {
            let _slots = {};
            for (let key in slots) {
                const slot = slots[key];
                if (typeof slot === "function") {
                    // _slots[key] = slot; // TODO 
                    _slots[key] = slot(cellProps);
                    continue;
                } else if (Array.isArray(slot)) {
                    /** 循环渲染本组件 */
                    _slots[key] = slot.map((item) => {
                                return (
                                    <RenderCell
                                        item={item}
                                        allItems={cellProps.allItems}
                                        isFormItem={isFormItem}
                                        formData={cellProps.formData}
                                        defaultSlot={cellProps.defaultSlot}
                                    ></RenderCell>
                                );
                            });
                } else if (typeof slot === "object") {
                    if(slot.constructor.name==='VNode'){
                        // 直接传入jsx渲染组件对象
                        _slots[key] = slot;
                    }else{
                        /** 渲染自定义组件 */
                        _slots[key] = <RenderCell
                                    item={slot}
                                    allItems={cellProps.allItems}
                                    isFormItem={isFormItem}
                                    formData={cellProps.formData}
                                    defaultSlot={cellProps.defaultSlot}
                                ></RenderCell>
                    }

                }
            }
            return _slots;
        };
        
        const vSlots = (slotsData,loadData)=>{
            const _slots = []
            Object.keys(slotsData).forEach(key=>{
                if(isVNode(slotsData[key])){
                    _slots.push(<template slot={key}>{slotsData[key]}</template>)
                }else if(isRenderCell(slotsData[key])){
                    _slots.push(<RenderCell isFormItem={false} qData={loadData} item={slotsData[key]}></RenderCell> )
                }else if(typeof slotsData[key] === 'function'){
                    _slots.push(<template slot={key}>{slotsData[key](loadData)}</template>)
                }
                
            })
            return _slots
        }
        // const cellProps = $props
        const $rcell = this;
        let {
        id = uuid(),
        label,
        width,
        tip,
        span,
        slot,
        mask,
        options=[],
        directives=[],
        render,
        debounce = false,
        slots = {}, // 用于自定义插槽
        props = {},
        on = {},
        show = true,
        hasBorder=true,
        formItemProps={},
        canShowFunc,
        isFormItem, // 如果有item内部参数isFormItem，以这个为优先
        ...rest
    } = this._props.item;
    const $props = this._props;
    if(isFormItem === undefined){
        isFormItem = $props.isFormItem;
    }

    const loadData = {
        item: $props.item,
        data: $props.formData,
        qData: $props.qData,
        allItems: $props.allItems,
        $rcell
    };
    props = {...this.defaultProp,...props}
    // 递归检查props里面的属性，如果有方法，给方法包装参数
    props = toEventsAppendParamsDeep(props, loadData, this);

    if (canShowFunc && typeof canShowFunc === "function") {
        show = canShowFunc(loadData) || false;
    }

    if (!show) return null;

    // 处理默认change
    if(!on.change){
        on.change = ()=>{
        }
    }
    if(options){
        if(['AsyncFunction','Function'].includes(options.constructor.name)){
            this.item.options = []
            const nv = options(loadData)
            options = []
            if(nv.constructor.name === 'Promise'){
                // 判断是否Promise
                nv.then(res=>{
                    this.item.options = res
                    this.$forceUpdate()
                })
            }else{
                this.item.options = nv
                options = nv
            }
        }else if(options.constructor.name === 'Promise'){
            this.item.options = []
            options.then(res=>{
                this.item.options = res
                this.$forceUpdate()
            })
            options = []
        }        
    }
    const onEvent = toEventsAppendParams(on, loadData, this);
    /** 将tip复制给placeholder来用 */
    if (!props.placeholder && tip) {
        props.placeholder = tip;
    }
    let dom = null;
    if (!slot) slot = $props.defaultSlot;
    slots = initSlots(slots, $props);

    let needVModel = true;
    let debounceVModel = debounce ? true : false; // 是否需要防抖
    let debounceTime = 80;
    let needProps = true;
    let needEvent = true;

    if (typeof debounce === "number") {
        debounceTime = debounce;
    }

    switch (slot) {
        case "link":
            dom = <el-link >{tip}</el-link>;
            needVModel = false;
            break;
        case "span":
            dom = (
                <span {...props} >
                    {getPathValue(id, $props.formData,rest.noValue)}
                </span>
            );
            // vue2.6.11版本，原生组件的事件需要放到data下的on里面
            dom.data = {...props,on:onEvent}
            needVModel = false;
            needProps = false;
            needEvent = false;
            break;
        case "input":
            dom = mask ? (
                <el-input v-mask={mask}/>
            ) : (
                <el-input/>
            );
            break;
        case "input-number":
            dom = <el-input-number  />;
            break;
        case "select":
            dom = (
                <el-select >
                    {options.map((item,i_) => (
                        <el-option
                            key={i_}
                            props={item}
                        ></el-option>
                    ))}
                </el-select>
            );
            this.handleStyle(props);
            break;
        case 'select-more':
            dom = (
                <RSelectLoadMore
                />
            );
            this.handleStyle(props);
            break;
        case "radio":
            dom = <el-radio >{tip}</el-radio>;
            break;
        case "radio-group":
            dom = (
                <el-radio-group >
                    {options.map((item) => (
                        rest.isButton?<el-radio-button label={item.value}
                            disabled={item.disabled}>{item.label}</el-radio-button>:
                        <el-radio
                            label={item.value}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </el-radio>
                    ))}
                </el-radio-group>
            );
            break;
        case "checkbox":
            dom = <el-checkbox >{tip}</el-checkbox>;
            break;
        case "checkbox-group":
            this.currentValue = this.value?this.value:[]
            dom = (
                <el-checkbox-group >
                    {options.map((item) => (
                        rest.isButton?<el-checkbox-button label={item.value}
                            disabled={item.disabled}>{item.label}</el-checkbox-button>:
                        <el-checkbox
                            label={item.value}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </el-checkbox>
                    ))}
                </el-checkbox-group>
            );
            break;
        case "checkbox-group-radio":
            this.currentValue = this.value?this.value:''
            dom = (
                <el-radio-group >
                    {options.map((item) => (
                        rest.isButton?<el-radio-button label={item.value}
                            disabled={item.disabled}>{item.label}</el-radio-button>:
                        <el-radio
                            label={item.value}
                            disabled={item.disabled}
                        >
                            {item.label}
                        </el-radio>
                    ))}
                </el-radio-group>
            );
            break;
        case 'checkbox-group-radio-tools':
            this.currentValue = this.value ? this.value : '';
            dom = (
            <el-radio-group>
                {options.map((item, fieldIndex) =>
                item.tooltip ? (
                    <el-tooltip class="item" effect="dark" key={fieldIndex} content={item.tooltip} placement="top-start">
                    <el-radio-button label={item.key}>
                        <span class="radio-group-item-label">{item.label}</span>
                        {item.num ? <el-badge value={item.num} max={99} class="item"></el-badge> : ''}
                    </el-radio-button>
                    </el-tooltip>
                ) : (
                    <el-radio-button label={item.key} key={fieldIndex}>
                    <span class="radio-group-item-label">{item.label}</span>
                    {item.num ? <el-badge value={item.num} max={99} class="item"></el-badge> : ''}
                    </el-radio-button>
                )
                )}
            </el-radio-group>
            );
            this.handleStyle(props);
            break;  
        case "date-picker":
            dom = <el-date-picker ></el-date-picker>;
            break;
        case "time-picker":
            debounceVModel = true;
            dom = <el-time-picker/>
            break;
        case "switch":
            dom = <el-switch ></el-switch>;
            break;
        case "slider":
            dom = <el-slider ></el-slider>;
            break;
        case "rate":
            dom = <el-rate ></el-rate>;
            break;
        case "tag":
            dom = <el-tag>{tip}</el-tag>
            needVModel = false;
            break;
        case "color-picker":
            dom = <el-color-picker ></el-color-picker>;
            break;
        case "cascader":
            props.options = options;
            props.filterable = props.filterable !== undefined ? props.filterable : true;  // 如果filterable未定义，设置为true
            dom = <el-cascader ></el-cascader>;
            this.handleStyle(props);
            break;
        case "render":
            needVModel = false;
            needProps = false;
            dom = (
                <Renderer
                    params={loadData}
                    render={render}
                ></Renderer>
            );
            break;
        case "button":
            dom = <el-button >{tip}</el-button>;
            needVModel = false;
            break;
        case "popconfirm":
            needVModel = false;
            dom = <el-popconfirm ></el-popconfirm>;
            break;
        case "export":
            needVModel = false;
            dom = <SplitDownloadAndExport></SplitDownloadAndExport>;
            break;
        default:
            /** 自定义扩展组件，如果不需要配置数据、事件和v-model，请将loadData.$rcell上的几个参数关闭 */
            if($c.get('extendedRenderCell')[slot]){
                this.needVModel = needVModel
                this.needProps = needProps
                this.needEvent = needEvent
                dom = $c.get('extendedRenderCell')[slot](h,loadData)
                needVModel = this.needVModel
                needProps = this.needProps
                needEvent = this.needEvent
            }else{
                console.error("RenderCell组件", slot, "未定义"); // eslint-disable-line
                dom = null;
            }
            break;
    }

    if (needProps) {
        if(!dom.componentOptions){
            dom.componentOptions = {}
        }
        
        if(!dom.componentOptions.propsData){
            dom.componentOptions.propsData = {};
        }
        dom.componentOptions.propsData = Object.assign(dom.componentOptions.propsData || {}, {
            ...props,
            ...rest
        });
    }
    
    if(needEvent && onEvent && Object.keys(onEvent).length){
        dom.componentOptions.listeners = {
            ...(dom.componentOptions.listeners||{}),
            ...onEvent
        }
    }
    if(!dom.data){
        dom.data = {}
    }
    if(!dom.data.attrs){
        dom.data.attrs = {}
    }
    if (directives && !dom.data.directives) {
        dom.data.directives = directives;
    }
    if (needVModel) {
        this.checkDomData(dom)
        dom.componentOptions.propsData.value = this.currentValue;
        if (debounceVModel) {
            const update = createDebounceUpdateValue(
                id,
                this,
                debounceTime,
                onEvent.input
            );
            dom.componentOptions.listeners["input"] = $event => update($event);
        } else {
            dom.componentOptions.listeners['input'] = ($event)=>{
                this.currentValue = $event
                if(onEvent.input){
                    onEvent.input($event)
                }
            }
        }
        dom.data.attrs = {...dom.componentOptions.propsData}
    }
    if(slots && Object.keys(slots).length){
        dom.componentOptions.children = vSlots(slots,loadData)
    }
    
    if (isFormItem) {
        formItemProps = deepAssign({
            key:id,
            label:label,
            prop:id,
            style:{width:width},
        },formItemProps)
        const addClassName = needVModel&&hasBorder?'hasBorder':''
        if(formItemProps.class){
            formItemProps.class = formItemProps.class + ' ' +addClassName
        }else{
            formItemProps.class = addClassName
        }
        const formItem = <el-form-item class={formItemProps.class}/>
        formItem.componentOptions.propsData = formItemProps
        formItem.componentOptions.children = [dom]
        return formItem;
    } else {
        if(dom.componentOptions && dom.componentOptions.propsData){
            dom.componentOptions.propsData.key = id;
        }
        this.handleStyle(dom)
        return dom;
    }
    },
};
</script>
<style lang="scss" scoped>
v-deep  .el-badge__content {
  font-size: 12px;
  height: 16px;
  line-height: 15px;
  vertical-align: middle;
}
.radio-group-item-label {
  margin-right: 3px;
  vertical-align: middle;
}
v-deep  .el-radio-button__inner{
  height: 34px;
}
</style>
