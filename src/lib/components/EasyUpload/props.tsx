
import { before } from 'node:test';
import { imageTypes, createAccept } from './utils';
import { config as $c } from '../../config';

export default {
    /** 上传模式
     * append: 追加模式，每次上传都会追加到原有的文件列表中
     * template: 模板模式，每次上传都会替换原有的文件列表（模板模式里面可以控制每个文件的类型和尺寸限制）
     */
    mode: {
        type: String,
        default: $c.get('upload.mode')
    },
    /**
     * 是否允许缩放
     */
    useZoom:{
        type: Boolean,
        default: $c.get('upload.useZoom')
    },
    /**
     * forceZoom: 是否强制缩放，如果为true，会强制缩放到zoomLimit的限制
     * useZoom为false的时候，forceZoom无效
     */
    forceZoom:{
        type: Boolean,
        default: $c.get('upload.forceZoom')
    },
    /** 
     * 自定义缩放方法
     * @params {blob} file 图片文件
     * @params {Object} zoomLimit 缩放限制参数
     * @params {Number} zoomLimit.width 宽度限制
     * @params {Number} zoomLimit.height 高度限制
     */
    zoomFunc:{
        type: Function,
        default: $c.get('upload.zoomFunc')
    },
    /** 
     * 缩放限制，如果只传一个值，表示按它优先缩放，另一个值会按比例缩放
     * 如果两个值都传，剪裁的时候会按照这个限制剪裁
     * 如果不剪裁，会按照最小的值缩放
     * width: 宽度限制
     * height: 高度限制
     */
    zoomLimit:{
        type: Object,
        default:()=>{
            return $c.get('upload.zoomLimit')
        }
    },
    /**
     * 缩放质量
     * 0-1之间的数字，表示图片质量
     */
    quality:{
        type: Number,
        default: $c.get('upload.quality')
    },
    /**
     * 转换图片后缀, 默认不转换
     * 如果设置了convertExt，会转换成convertExt的后缀：只支持jpg、webp、png
     */
    convertExt:{
        type: String,
        default: $c.get('upload.convertExt')
    },
    /**
     * 是否使用水印
     */
    useWatermark:{
        type: Boolean,
        default: $c.get('upload.useWatermark')
    },
    /**
     * 水印配置： 参考watermarkjs
     * @param {target} canvas 水印目标画板 方便自己写水印
     * @param {String} text 水印文字
     * @param {Object} watermark watermarkjs对象
     * @returns {Object} 返回canvas对象 或者 watermark.text.lowerLeft等方法的返回值
     */
    watermarkFunc:{
        type: Function,
        default:$c.get('upload.convertExt')
    },
    /** 
     * 水印文字：默认会根据文件名生成水印文字平铺在图片上
     * 如果设置了watermarkText，会使用watermarkText作为水印文字
     * 如果设置了useWatermark为false，会忽略watermarkText
     * 如果配置了watermarkFunc，会忽略watermarkText
     */
    watermarkText:{
        type: String,
        default: $c.get('upload.watermarkText')
    },
    /** 
     * 允许修改水印文字: 必须要允许剪裁的时候生效，会让用户输入水印文字
     */
    allowChangeWatermarkText:{
        type: Boolean,
        default: $c.get('upload.allowChangeWatermarkText')
    },
    /**
     * 是否允许手动裁剪: 如果为true，那缩放和水印都在裁剪时候体现
     * 如果为false，不会弹出剪裁框，这种情况下，`forceZoom`强制缩放参数=true的话，会直接缩放到zoomLimit的限制
     */
    useCropper:{
        type: Boolean,
        default: $c.get('upload.useCropper')
    },
    ratioList:{
        type: Array,
        default: () => {
            return $c.get('upload.ratioList')
        }
    },
    modelValue: {
        type: [String, Array],
        default: ''
    },
    /** 
     * value 格式类型
     * string: 单个文件路径;多个文件路径用逗号分隔
     * array: 多个文件路径
     * array<object>: 数组的每个元素是一个对象，包含url和name属性
     */
    valueFormat: {
        type: String,
        default: $c.get('upload.valueFormat')
    },
    /** value无数据，但是又disabled的时候，会有一个暂无数据的提示 */
    noDataText: {
        type: String,
        default: $c.get('upload.noDataText')
    },
    /**
     * 如果valueType为string，用什么符号分割多个文件路径
     */
    valueSplit: {
        type: String,
        default: $c.get('upload.valueSplit')
    },
    /** 当valueType=array时候，
     * 数组的每个元素是一个对象，包含url和name属性
     */
    valueProps: {
        type: Object,
        default: () => {}
    },
    /** 是否禁用组件响应 */
    disabled: {
        type: Boolean,
        default: $c.get('upload.disabled')
    },
    /** 组件可以上传数量
     * 0: 无限制
     */
    limit: {
        type: Number,
        default: $c.get('upload.limit')
    },
    /** 文件尺寸限制，MB */
    size: {
        type: Number,
        default: $c.get('upload.size')
    },
    /** 文件最小尺寸限制，MB
     * 0: 无限制
     */
    minSize: {
        type: Number,
        default: $c.get('upload.minSize')
    },
    accept: {
        type: String,
        default: $c.get('upload.accept')
    },
    /** 组件根节点 */
    uploadClass: {
        type: String,
        default: $c.get('upload.uploadClass')
    },
    /** 上传按钮class */
    uploadButtonClass: {
        type: String,
        default: $c.get('upload.uploadButtonClass')
    },
    uploadButtonText: {
        type: String,
        default: $c.get('upload.uploadButtonText')
    },
    reviewClass: {
        type: String,
        default: $c.get('upload.reviewClass')
    },
    /** 陈列区，单box宽度 */
    itemWidth: {
        type: [Number,String],
        default: $c.get('upload.itemWidth')
    },
    /**
     * 陈列区，单box高度
     */
    itemHeight: {
        type: [Number,String],
        default: $c.get('upload.itemHeight')
    },
    /** 预览框和剪切框的层级 */
    zIndex: {
        type: Number,
        default: $c.get('upload.zIndex')
    },
    /** 是否显示标题 */
    showItemTitle: {
        type: Boolean,
        default: $c.get('upload.showItemTitle')
    },
    /** 删除前询问
     * @param {Object} file 当前删除的文件
     * @param {Number} index 当前删除的文件索引
     *  可以返回一个Promise，如果返回的是一个Promise，reject的时候会取消删除操作
     *  也可以返回一个Boolean，如果返回的是false，组件会取消删除操作
     */
    beforeRemove: {
        type: Function,
        default: $c.get('upload.beforeRemove')
    },
    /** 上传前询问
     * @param {Object} file 当前上传的文件
     * @returns {Boolean} 如果返回false，组件会取消上传操作
     * 可以返回一个Promise，如果返回的是一个Promise，reject的时候会取消上传操作
     * 也可以返回一个Boolean，如果返回的是false，组件会取消删除操作
     */
    beforeUpload: {
        type: Function,
        default: $c.get('upload.beforeUpload')
    },
    /** 上传url，如果使用这个，将使用内置上传fetch调用 */
    action: {
        type: String,
        default: $c.get('upload.action')
    },
    /**
     * 内置上传fetch调用的headers
     */
    headers: {
        type: Object,
        default: () => {
            return $c.get('upload.headers')
        }
    },
    /**
     * 内置上传fetch调用的附加data
     */
    data: {
        type: Object,
        default: () => {
            return $c.get('upload.data')
        }
    },
    /** 上传的文件字段名称 */
    name: {
        type: String,
        default: $c.get('upload.name')
    },
    /** 
     * 上传完成后，返回的数据里，文件路径的key，支持.分割
     */
    responseSrcPath: {
        type: String,
        default: $c.get('upload.responseSrcPath')
    },
    /** 
     * 你自己封装上传接口，可以使用这个函数
     * @param {File} file 
     */
    uploadFunc: {
        type: Function,
        default: $c.get('upload.uploadFunc')
    },
};