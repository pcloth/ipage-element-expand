<template>
    <div class="easy-upload-cropper" v-if="show" :style="{
        zIndex: zIndex
    }">
        <div class="easy-upload-cropper-mask" :style="{
            zIndex: zIndex + 1
        }" @click="onCancelCropper" />
        <div class="easy-upload-cropper-content" :style="_mergeContentStyle">
            <div class="easy-upload-cropper-content-close" @click="onCancelCropper">
                x
            </div>
            <VueCropper v-if="show" ref="refCropper" :src="currentSrc" @crop-end="onCropEnd" @crop="onCropperInfo"
                :options="_mergeOptions" />
            <div class="easy-upload-cropper-toolbar" v-if="showRatioController">
                <el-radio-group v-model="currentRatio" @change="changeCurrentRatio">
                    <el-radio-button :value="item.value" v-for="item in _mergeRatioList" :key="item.value">{{ item.label
                        }}</el-radio-button>
                </el-radio-group>
            </div>
            <div class="easy-upload-cropper-toolbar preview-box">
                <div ref="previewCanvasRef" class="easy-upload-cropper-viewers" />
                <div class="easy-upload-zoom-toolbox" v-if="useZoom">
                    <div class="easy-upload-cropper-toolbar">
                        <div class="zoom-toolbox-row">
                            <el-checkbox :disabled="_parentLockSize" @change="changeLockZoom($event, 'width')"
                                v-model="isLockSizeOutWidth">按宽度缩放</el-checkbox>
                            <el-input v-model="currentWidth" size="small" :input-style="{ textAlign: 'right' }"
                                :disabled="!isLockSizeOutWidth || _parentLockSize"
                                @change="setZoomSize($event, 'width')">
                                <template #prefix>宽度:</template>
                                <template #append> 像素 </template>
                            </el-input>
                        </div>
                        <div class="zoom-toolbox-row">
                            <el-checkbox :disabled="_parentLockSize" v-model="isLockSizeOutHeight"
                                @change="changeLockZoom($event, 'height')">按高度缩放</el-checkbox>
                            <el-input v-model="currentHeight" size="small" :input-style="{ textAlign: 'right' }"
                                @change="setZoomSize($event, 'height')"
                                :disabled="!isLockSizeOutHeight || _parentLockSize">
                                <template #prefix>高度:</template>
                                <template #append> 像素 </template>
                            </el-input>
                        </div>
                        <div class="zoom-toolbox-row" v-if="useWatermark">
                            <el-checkbox @change="changeWatermarkText()" :disabled="!allowChangeWatermarkText"
                                v-model="useWatermarkValue">使用水印</el-checkbox>
                            <el-input v-model="watermarkTextValue" size="small" :input-style="{ textAlign: 'right' }"
                                :disabled="!allowChangeWatermarkText || !useWatermarkValue"
                                @change="changeWatermarkText">
                            </el-input>
                        </div>
                    </div>
                    <div class="zoom-toolbox-row easy-upload-cropper-buttons">
                        <el-button @click="onCancelCropper">取消</el-button>
                        <el-button :loading="uploadLoading" type="primary" @click="onCropper">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueCropper from './vueCropperjs';
import { makeWatermark, zoomImage, debounce } from "./utils";

export default {
    name: "EasyUploadCropper",
    components: {
        VueCropper
    },
    props: {
        src: {
            type: String,
            default: ''
        },
    quality: {
        type: Number
    },
    /** 
     * 图片信息
     */
    srcItem: {
        type: Object,
        default: () => {
            return {}
        }
    },
    show: {
        type: Boolean,
        default: false
    },
    zIndex: {
        type: Number,
        default: 2500
    },
    /** 
     * 窗体样式
     */
    contentStyle: {
        type: Object,
        default: () => {
            return {}
        }
    },
    /** 
     * 是否锁定宽高的尺寸到width和height像素
     */
    isLockSize: {
        type: Boolean,
        default: false
    },
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    /**
     * https://github.com/fengyuanchen/cropperjs 详细配置
     */
    options: {
        type: Object,
        default: () => ({
            aspectRatio: 1 / 1,
            autoCropArea: 0.8
        })
    },
    /** 不锁定的时候，显示比例控制器 */
    showRatioController: {
        type: Boolean,
        default: true
    },
    /**
     * 是否使用缩放功能
     */
    useZoom: {
        type: Boolean,
        default: true
    },
    forceZoom: {
        type: Boolean,
        default: false
    },
    zoomLimit: {
        type: Object
    },
    /**
     * 剪裁比例列表
     */
    ratioList: {
        type: Array,
    },
    /**
     * 是否使用水印
     */
    useWatermark: {
        type: Boolean,
        default: true
    },
    /**
     * 水印配置： 参考watermarkjs
     * @param {target} canvas 水印目标画板 方便自己写水印
     * @param {String} text 水印文字
     * @param {Object} watermark watermarkjs对象
     * @returns {Object} 返回canvas对象 或者 watermark.text.lowerLeft等方法的返回值
     */
    watermarkFunc: {
        type: Function
    },
    /** 
     * 水印文字：默认会根据文件名生成水印文字平铺在图片上
     * 如果设置了watermarkText，会使用watermarkText作为水印文字
     * 如果设置了useWatermark为false，会忽略watermarkText
     * 如果配置了watermarkFunc，会忽略watermarkText
     */
    watermarkText: {
        type: String,
        default: ''
    },
    /** 
     * 允许修改水印文字: 必须要允许剪裁的时候生效，会让用户输入水印文字
     */
    allowChangeWatermarkText: {
        type: Boolean,
        default: false
    },
    uploadLoading: {
        type: Boolean,
        default: false
    }
    },
    data() {
        return {
            watermarkTextValue: this.watermarkText,
            useWatermarkValue: this.useWatermark,
            previewSrc: "",
            previewInfo: {},
            currentWidth: 0,
            currentHeight: 0,
            isLockSizeOutWidth: false,
            isLockSizeOutHeight: false,
            clipping: false,
            currentSrc: this.src,
            currentRatio: 0
        };
    },
    computed: {
        _parentLockSize() {
            return this.forceZoom && this.zoomLimit;
        },
        
        /** 高宽都用像素锁定 */
        _parentLockSizeWidthHeight() {
            return this.forceZoom && this.zoomLimit && this.zoomLimit.width && this.zoomLimit.height;
        },
        
        _mergeContentStyle() {
            return {
                width: '700px',
                zIndex: this.zIndex + 2,
                ...this.contentStyle,
            };
        },
        
        _mergeRatioList() {
            const arr = [
                ...(this.ratioList || [])
            ];
            
            return arr;
        },



        /** 给cropperjs的配置参数 */
        _mergeOptions() {
            const _mp = {
                aspectRatio: 1 / 1,
                autoCropArea: 0.8,
                ...this.options
            };
            _mp.autoCrop = this.currentRatio < 0 ? false : true;
            if (this.currentRatio <= 0) {
                _mp.aspectRatio = false;
            } else {
                _mp.isLockSize = true;
                _mp.aspectRatio = this.currentRatio;
            }
            return _mp;
        }
    },
    watch: {
        src(val) {
            this.currentSrc = val;
        }
    },
    created() {
        this.currentRatio = this.initCurrentRatio();
    },
    methods: {
        initCurrentRatio() {
            let value = 0;
            if(!this._mergeRatioList || this._mergeRatioList.length === 0){
                return value;
            }
            const def = this._mergeRatioList.find(item => item.isDefault);
            if(def){
                value = def.value;
            } else {
                value = this._mergeRatioList[0].value;
            }
            return value;
        },
        onCropEnd() {
            if (this.isLockSize) {
                return;
            }
            const cropper = this.$refs.refCropper.cropper;
            const box = cropper.getCropBoxData();
            const ratio = box.width / box.height;
            const has = this._mergeRatioList.find(item => item.value === ratio);
            if (!has) {
                // 如果没有找到，就是自由剪裁
                this.currentRatio = 0;
            } else {
                this.currentRatio = ratio;
            }
        },

        canvasToBlob(canvas, type = undefined, quality = 1) {
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, type, quality);
            });
        },
        
        changeWatermarkText() {
            this.$emit('update:watermarkText', this.watermarkTextValue);
            this.onCropperInfo({ detail: this.previewInfo });
        },
        
        async _onCropperInfo(e) {
            if (!e.detail.width || this.clipping) {
                return;
            }
            const data = JSON.parse(JSON.stringify(e.detail));
            this.previewSrc = data.preview;
            data.width = Math.ceil(e.detail.width);
            data.height = Math.ceil(e.detail.height);
            data.x = Math.ceil(data.x);
            data.y = Math.ceil(data.y);
            this.previewInfo = data; //JSON.parse(JSON.stringify(data));
            let canvas = this.$refs.refCropper.cropper.getCroppedCanvas();
            if (this._parentLockSize) {
                if (this.zoomLimit) {
                    let w = this.zoomLimit.width;
                    let h = this.zoomLimit.height;
                    let ratio = 0;
                    if (w && h) {
                        // 如果两个都有，强制比例
                        ratio = +(w / h).toFixed(2);
                        if (this.currentRatio !== ratio) {
                            this.currentRatio = ratio;
                            this.changeCurrentRatio(ratio);
                        }
                        this.currentWidth = w;
                        this.currentHeight = h;
                        this.isLockSizeOutWidth = true;
                        this.isLockSizeOutHeight = true;
                        // this.changeCurrentRatio(ratio);
                    } else if (w) {
                        ratio = w / data.width;
                        this.currentWidth = w;
                        this.currentHeight = Math.ceil(data.height * ratio);
                        this.isLockSizeOutWidth = true;
                    } else if (h) {
                        ratio = h / data.height;
                        this.currentHeight = h;
                        this.currentWidth = Math.ceil(data.width * ratio);
                        this.isLockSizeOutHeight = true;
                    }
                }
            } else {
                this.currentHeight = canvas.height;
                this.currentWidth = canvas.width;
            }
        
        
            canvas.style.objectFit = "contain";
            canvas.style.maxWidth = "100%";
            canvas.style.maxHeight = "100%";
        
            const previewCanvasRef = this.$refs.previewCanvasRef;
            if (this.useWatermarkValue) {
                const watermarkText = this.watermarkTextValue;
                const imgBolb = await this.canvasToBlob(canvas);
                const bolb = await makeWatermark(imgBolb, watermarkText, this.watermarkFunc);
                // 把bolb 绘制到canvas上
                const img = new Image();
                img.src = URL.createObjectURL(bolb);
                img.onload = () => {
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                previewCanvasRef.innerHTML = "";
                previewCanvasRef.appendChild(canvas);
            } else {
                previewCanvasRef.innerHTML = "";
                previewCanvasRef.appendChild(canvas);
            }
        },
        
        setCopperSize() {
            const cropper = this.$refs.refCropper.cropper;
            this.previewInfo.width = +this.previewInfo.width;
            this.previewInfo.height = +this.previewInfo.height;
            this.previewInfo.x = +this.previewInfo.x;
            this.previewInfo.y = +this.previewInfo.y;
            cropper.setData(this.previewInfo);
        },
        
        changeLockZoom(value, key) {
            if (value) {
                if (key === "width") {
                    this.isLockSizeOutHeight = false;
                } else {
                    this.isLockSizeOutWidth = false;
                }
            }
        },
        
        setZoomSize(value, key) {
            let width = this.previewInfo.width;
            let height = this.previewInfo.height;
            let ratio = 0;
            if (key === "width") {
                ratio = width / this.currentHeight;
                height = Math.ceil(value / ratio);
                this.currentHeight = height;
            } else {
                ratio = height / this.currentWidth;
                width = Math.ceil(value / ratio);
                this.currentWidth = width;
            }
        },

        async changeCurrentRatio(value) {
            const cropper = this.$refs.refCropper.cropper;
            if (value === -1) {
                cropper.setAspectRatio(NaN);
                cropper.clear();
                this.previewInfo = {
                    x: 0,
                    y: 0,
                    width: this.currentWidth,
                    height: this.currentHeight
                };
            } else {
                value = +value.toFixed(2);
                const obj = cropper.getCropBoxData();
                this.currentHeight = obj.height;
                this.currentWidth = obj.width;
                cropper.setAspectRatio(value);
                cropper.crop();
            }
        },
        
        onCancelCropper() {
            this.$emit('cancel');
            this.$emit('update:show', false);
        },
        
        /** 裁剪开始，todo输出格式和压缩率等信息 */
        async onCropper() {
            await this.$nextTick();
            this.clipping = true;
            const cropper = this.$refs.refCropper.cropper;
            const canvasOptions = this.isLockSize
                ? { width: this.width, height: this.height }
                : {};
        
            // 这个截图工具无法放大，只能缩小，改为后面自己处理缩放
            // if (this.isLockSizeOutWidth || this.isLockSizeOutHeight) {
            //     canvasOptions.width = Number(this.currentWidth);
            //     canvasOptions.height = Number(this.currentHeight);
            //     cropper.crop();
            //     const sizeData = this.refCropper.cropper.getCanvasData();
            //     cropper.setCropBoxData({
            //         height: sizeData.naturalHeight,
            //         width: sizeData.naturalWidth,
            //         top: 0,
            //         left: 0
            //     });
            // }
            const canvas = cropper.getCroppedCanvas(canvasOptions);
            let blob = await this.canvasToBlob(canvas);
            // 缩放
            if (this.isLockSizeOutWidth || this.isLockSizeOutHeight) {
                const params = {}
                if (this.isLockSizeOutWidth) {
                    params["width"] = this.currentWidth;
                }
                if (this.isLockSizeOutHeight) {
                    params["height"] = this.currentHeight;
                }
                blob = await zoomImage(blob, params);
            }
        
            if (this.useWatermarkValue) {
                const watermarkText = this.watermarkTextValue;
                blob = await makeWatermark(blob, watermarkText, this.watermarkFunc);
            }
        
            this.clipping = false;
            this.$emit("cropped", blob);
        },
        
        onCropperInfo(e) {
            // 使用debounce封装_onCropperInfo函数
            const debouncedFn = debounce(this._onCropperInfo.bind(this), 100, false);
            debouncedFn(e);
        }
    },
    mounted() {
        // 这里可以添加组件挂载后的逻辑
        this.$nextTick(() => {
            this.previewCanvasRef = this.$refs.previewCanvasRef;
        });
    }
}
</script>

<style lang="scss" scoped>
.easy-upload-cropper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;


    .easy-upload-cropper-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 1000;
    }

    .easy-upload-cropper-content {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 7px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
        // overflow: hidden;
        padding: 10px;

        .easy-upload-cropper-content-close {
            position: absolute;
            top: -30px;
            right: -25px;
            cursor: pointer;
            font-size: 30px;
            color: #FFF;
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

            img {
                width: 20px;
                height: 20px;
            }
        }

        .easy-upload-cropper-toolbar {
            // margin-top: 10px;
            display: flex;
            flex-direction: column;
            padding: 5px 0;

            // background-color: #f0f0f0;
            .easy-upload-cropper-toolbar_title {
                font-size: 14px;
                color: #333;
                margin-bottom: 5px;
            }

        }

        .preview-box {
            flex-direction: row;
            gap: 20px;

            .easy-upload-cropper-viewers {
                width: 300px;
                height: 200px;
            }

            .easy-upload-zoom-toolbox {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .el-input {
                    width: calc(100% - 150px);
                }

                .el-checkbox {
                    margin-right: 10px;
                }

            }




        }
    }

    .zoom-toolbox-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .easy-upload-cropper-buttons {
        justify-content: flex-end;
    }
}

.zoom-toolbox-row {
    ::v-deep(.el-input__prefix) {
        display: flex;
        align-items: center;
        padding-right: 5px;
    }

    ::v-deep(.el-input__inner) {
        padding-left: 40px;
    }
}
</style>