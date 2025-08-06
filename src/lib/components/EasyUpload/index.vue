<template>
    <div :class="uploadClass">
        <slot :fileList="fileList" name="default">
            <template v-for="(file, idx) in fileList" :key="file.uuid">
                <div class="easy-upload-review-item-outside">
                    <div :style="mergeReviewItemStyle" :class="mergeReviewClass(file)">
                        <!-- 如果是template模式下，如果没有图片，显示上传按钮 -->
                        <template v-if="!disabled && mode === 'template' && !file[mergeValueProps.url]">
                            <slot name="upload-button" :upload="hanldeClickUpload" :file="file">
                                <div :class="[uploadButtonClass, 'template-upload']" :style="mergeReviewItemStyle"
                                    @click.stop="hanldeClickUpload(file)">
                                    + 点击上传
                                </div>
                            </slot>
                        </template>
                        <template
                            v-else-if="disabled && mode === 'template' && !file[mergeValueProps.url]">
                            <div class="upload-no-data">{{ noDataText }}</div>
                        </template>
                        <img v-else-if="_getFileType(file) === 'img'" class="review-image"
                            :src="file[mergeValueProps.url]" alt="" />
                        <video v-else-if="_getFileType(file) === 'video'" class="review-image"
                            :poster="file[mergeValueProps.poster]" :controls="file[mergeValueProps.controls]"
                            :src="file[mergeValueProps.url]"></video>
                        <div v-else class="review-image">
                            {{ getFileSuffix(file[mergeValueProps.url]) }}
                        </div>
                        <div class="easy-upload-review-item-mask">
                            <img @click.stop="viewImage(file)" title="预览"
                                v-if="['img', 'video'].includes(_getFileType(file))"
                                class="easy-upload-review-item-mask-btn-icon" src="./images/view-fill.png"></img>
                            <img @click.stop="downloadFile(file)" title="下载" v-else
                                class="easy-upload-review-item-mask-btn-icon" src="./images/download.png"></img>
                            <img @click.stop="remoteFile(file, idx)" v-if="!disabled" title="删除"
                                class="easy-upload-review-item-mask-btn-icon" src="./images/delete-fill.png"></img>
                        </div>

                        <div class="easy-upload-review-item-progress">
                            <!-- 上传进度 -->
                        </div>

                    </div>
                    <slot name="title" :file="file" :index="idx" :fileList="fileList">
                        <div v-if="showItemTitle && !file.error" class="easy-upload-review-item-title"
                            :style="mergeItemTitleStyle">{{
                                file.title || file.name || ''
                            }}</div>
                    </slot>
                    <div v-if="file?.status === 'error'" class="easy-upload-review-item-error">
                        <!-- 上传失败 -->
                        {{ file.error }}
                    </div>
                </div>
            </template>
            <template v-if="(disabled || mode === 'template') && fileList.length === 0">
                <div class="easy-upload-review-item-outside">
                    <div :style="mergeReviewItemStyle" :class="mergeReviewClass({})">
                        <div class="upload-no-data">{{ noDataText }}</div>
                    </div>
                </div>

            </template>
        </slot>
        <slot v-if="showUploadButton" name="upload-button" :upload="hanldeClickUpload" :file="null">
            <div class="easy-upload-review-item-outside">
                <div :class="mergeUploadButtonClass(currentItem)" :style="mergeReviewItemStyle"
                    @click.stop="hanldeClickUpload()">
                    + {{ uploadButtonText }}

                </div>
                <div v-if="currentItem?.status === 'error'" class="easy-upload-review-item-error">
                    {{ currentItem?.error }}
                </div>
            </div>
        </slot>
        <ReviewBox :zIndex="zIndex" :show="showReviewBox" @update:show="val => showReviewBox = val" :src="currentSrc" :isVideo="currentSrcIsVideo" />
        <Cropper @cancel="cancelUpload" :show="showCropper" @update:show="val => showCropper = val" :zIndex="zIndex" :src="currentSrc"
            :ratioList="ratioList"
            :src-item="currentItem" :useWatermark="useWatermark" :quality="quality" :useZoom="useZoom"
            :forceZoom="forceZoom" :uploadLoading="uploadLoading" :zoomLimit="zoomLimit"
            :watermarkText="watermarkText" :watermarkFunc="watermarkFunc"
            :allowChangeWatermarkText="allowChangeWatermarkText" @cropped="onCropped" />
    </div>
</template>
<script>
import { config as $c } from '../../config'

import props_ from './props'
import {
    promisify,
    imageTypes,
    videoTypes,
    createAccept,
    getUuid,
    getName,
    fileType,
    testIsBase64,
    getFileSuffix,
    makeWatermark,
    zoomImage,
    suffixToType,
    getFileFormatToCanvasType,
    getObjectValueByPath
} from './utils'
import ReviewBox from './reviewBox.vue'
import Cropper from './cropper.vue'

export default {
    name: 'EasyUpload',
    components: {
        ReviewBox,
        Cropper
    },
    props: props_,
    data() {
        return {
            fileList: [],
            currentItem: null,
            showReviewBox: false,
            currentSrc: '',
            currentSrcIsVideo: false,
            showCropper: false,
            uploadLoading: false
        }
    },
    computed: {
        mergeValueProps() {
            const default_ = $c.get('upload.valueProps') || {}
            return {
                ...(default_ || {}),
                ...(this.valueProps || {}),
            }
        },
        
        mergeReviewItemStyle() {
            const style_ = {};
            if (typeof this.itemWidth === 'number') {
                style_['width'] = this.itemWidth + 'px'
            } else {
                style_['width'] = this.itemWidth
            };

            if (typeof this.itemHeight === 'number') {
                style_['height'] = this.itemHeight + 'px'
            } else {
                style_['height'] = this.itemHeight
            };
            return style_;
        },
        
        mergeItemTitleStyle() {
            const style_ = {};
            if (typeof this.itemWidth === 'number') {
                style_['width'] = this.itemWidth + 'px'
            } else {
                style_['width'] = this.itemWidth
            };
            return style_;
        },
        
        mergeReviewClass() {
            return (file) => {
                let status = file.status === 'success' ? 'success' : 'error'
                return [this.reviewClass, {
                    'easy-upload-review-item-disabled': this.disabled,
                    'easy-upload-review-item-template': this.mode === 'template',
                    'is-upload': this.mode === 'template' && !file[this.mergeValueProps.url],
                    'is-error': file.status === 'error',
                }]
            }
        },
        
        mergeUploadButtonClass() {
            return (file) => {
                return [this.uploadButtonClass, 'template-upload', {
                    'is-error': file?.status === 'error',
                }]
            }
        },
        
        showUploadButton() {
            let status = this.disabled ? false : true
            // 检查当前文件数量是否满足
            if (status && this.limit > 0 && this.fileList.length >= this.limit) {
                status = false
            }
            if (this.mode === 'template') {
                // 模板模式下，不显示最后的上传按钮
                status = false
            }
            return status
        }



const mergeValueProps = computed(() => {
    const default_ = $c.get('upload.valueProps')||{}
    return {
        ...(default_||{}),
        ...(props.valueProps||{}),
    }
})

    },
    watch: {
        modelValue: {
            handler() {
                // 监听modelValue变化
                this.fileList = this.getModelValue();
            },
            immediate: true
        }
    },
    methods: {
        _getFileType(item) {
            return fileType(item[this.mergeValueProps.url] || "")
        },
        
        /** 从modelvalue获取文件列表 */
        getModelValue() {
            let arr = [];
            if (!this.modelValue) return arr;
            if (this.valueFormat === "array") {
                arr = this.modelValue;
            } else if(this.valueFormat === "array<object>"){
                // 追加模式的array-object，直接返回当前文件列表
                arr = this.modelValue
            } else if (this.valueFormat === "string") {
                if (!this.modelValue) {
                    arr = [];
                } else if (typeof this.modelValue === "string") {
                    if (testIsBase64(this.modelValue)) {
                        return [
                            {
                                uuid: getUuid(12, 17),
                                name: "base64图片" + getUuid(4, 17) + ".png",
                                src: this.modelValue,
                                status: "success",
                                isBase64: true
                            }
                        ];
                    }
                    arr = this.modelValue.split(this.valueSplit).filter(item => item);
                } else if (Array.isArray(this.modelValue)) {
                    arr = this.modelValue;
                } else {
                    console.error(
                        "ve-cropper组件valueFormat配置错误1",
                        this.modelValue
                    );
                }
            } else {
                console.error("ve-cropper组件valueFormat配置错误2", this.modelValue);
            }
            arr = arr.map((item) => {
                if (typeof item === 'object') {
                    if (!item.uuid) item.uuid = getUuid(12, 17);
                    if (!item.name) item.name = getName(item[this.mergeValueProps.url]);
                    if (!item.status) item.status = "success";
                    if (!item.type) item.type = fileType(item[this.mergeValueProps.url]);
                    return item
                }
                const obj = this.fileList.find((it) => it[this.mergeValueProps.url] === item);
                const uuid = obj?.uuid || getUuid(12, 17);
                const name = obj?.name || getName(item);
                return {
                    uuid,
                    [this.mergeValueProps.name]: name,
                    [this.mergeValueProps.url]: item,
                    status: "success",
                    type: fileType(item)
                };
            });
            return arr;
        },

        /** 输出modelValue */
        outPutValue() {
            let arr = [];
            if (this.mode === 'template') {
                // 模板模式下，直接返回当前文件列表
                const outarr = this.fileList.map((item) => {
                    const { raw, ...rest } = item
                    return rest
                })
                this.$emit("update:modelValue", outarr);
                return
            }
            this.fileList.forEach((item) => {
                if (item.status === "success") {
                    arr.push(item[this.mergeValueProps.url]);
                }
            });
            if (this.valueFormat === "array") {
                this.$emit("update:modelValue", arr);
            } else if(this.valueFormat === "array<object>"){
                // 追加模式的array-object，直接返回当前文件列表
                arr = this.fileList.map((item) => {
                    const { raw, ...rest } = item
                    return rest
                })
                this.$emit("update:modelValue", arr);
            } else if (this.valueFormat === "string") {
                this.$emit("update:modelValue", arr.join(this.valueSplit));
            } else {
                console.error("ve-cropper组件valueFormat配置错误");
            }
        },

const mergeReviewItemStyle = computed(() => {
    const style_: any = {};
    if (typeof props.itemWidth === 'number') {
        style_['width'] = props.itemWidth + 'px'
    } else {
        style_['width'] = props.itemWidth
    };

    if (typeof props.itemHeight === 'number') {
        style_['height'] = props.itemHeight + 'px'
    } else {
        style_['height'] = props.itemHeight
    };
    return style_;
});

const mergeItemTitleStyle = computed(() => {
    const style_: any = {};
    if (typeof props.itemWidth === 'number') {
        style_['width'] = props.itemWidth + 'px'
    } else {
        style_['width'] = props.itemWidth
    };
    return style_;
});

const mergeReviewClass = computed((file: any) => {
    return (file: any) => {
        let status = file.status === 'success' ? 'success' : 'error'
        return [props.reviewClass, {
            'easy-upload-review-item-disabled': props.disabled,
            'easy-upload-review-item-template': props.mode === 'template',
            'is-upload': props.mode === 'template' && !file[mergeValueProps.value.url],
            'is-error': file.status === 'error',
        }]
    }
});

const mergeUploadButtonClass = computed((file: any) => {
    return (file: any) => {
        return [props.uploadButtonClass, 'template-upload', {
            'is-error': file?.status === 'error',
        }]
    }
});

watch(() => props.modelValue, (newVal) => {
    // 监听modelValue变化
    fileList.value = getModelValue();
}, { immediate: true });



        /**
         * 
         * status:  
         * load = 加载文件
         * waitUpload = 等待上传(同时选中多个的时候，只有一个文件在上传)
         * croping = 裁剪中
         * croped = 裁剪完成
         * uploading = 上传中
         * success = 上传成功
         * error = 各种失败
         */
        createNewItem(params = {}) {
            return {
                uuid: getUuid(12, 17),
                name: params.name || '',
                [this.mergeValueProps.url]: params.url || '',
                status: params.status || '',
                accept: params.accept || this.accept,
                error: params.error || ''
            }
        },
        hanldeClickUpload(item = null) {
            // 如果是模板模式下，上传后替换当前模板的图片
            if (this.disabled) return;
            if (this.mode === 'template' && !item) {
                throw new Error('模板模式下，必须传入item')
            }
            this.currentItem = item ? item : this.createNewItem()
            this.currentItem.status = 'load'
            let accept = this.accept || "*.*";
            if (this.mode === 'template') {
                if (item[this.mergeValueProps.accept]) {
                    accept = item[this.mergeValueProps.accept]
                } else if (item[this.mergeValueProps.type]) {
                    const type = item[this.mergeValueProps.type]
                    if (type === 'img') {
                        accept = createAccept(imageTypes)
                    } else if (type === 'video') {
                        accept = createAccept(videoTypes)
                    } else {
                        accept = "*.*"
                    }
                }
            }
            this.currentItem.accept = accept
            // 打开文件选择框
            const input = document.createElement("input");
            input.type = "file";
            input.accept = accept;
            input.multiple = false;
            input.onchange = this.inputOnChange;
            input.click();
        },

        cancelUpload() {
            this.currentItem[this.mergeValueProps.url] = '';
            this.currentItem.raw = '';
            // this.currentItem.status = 'error'
            // this.currentItem.error = '用户取消'
        },
        
        async inputOnChange(e) {
            const file = e.target.files[0];
            if (!file) return;
            this.$emit("openfile", file);
            // 用户自己的检查
            const _beforeUpload = this.beforeUpload ? this.beforeUpload : () => Promise.resolve(true);
            const status = await promisify(_beforeUpload, file);
            if (!status) {
                return;
            }
            // 尺寸和文件文件检查
            if (!this.beforeUpload(file, this.currentItem)) {
                return;
            }
            this.currentItem.status = 'waitUpload';
            this.currentItem.raw = file;
            const type = fileType(file.name);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            const self = this;
            reader.onload = async function(e) {
                const base64 = e.target.result;
                // self.currentItem[self.mergeValueProps.url] = base64;
                self.currentItem.raw = base64;
                self.currentSrc = base64;
                self.currentItem.name = file.name;
                self.currentItem.type = type;
                self.currentItem.status = 'croping';
                // 如果是图片，并允许手动剪裁打开裁剪框
                if (type === 'img') {
                    if (self.useCropper) {
                        self.showCropper = true;
                        return;
                    }
                }
                // 直接上传
                await self.prepareToUpload(self.currentItem);
            };
        },

        beforeUpload(file, templateItem) {
            // 检查文件类型和大小
            const ext = file.name.split('.').pop();
            const accept = templateItem[this.mergeValueProps.accept] || this.accept;
            if (!accept || accept.includes('*.*')) {
                // 不限制文件类型
            } else if (accept) {
                if (!accept.toLowerCase().includes(ext.toLowerCase())) {
                    templateItem.status = "error";
                    templateItem.error = "文件类型不匹配";
                    this.$emit("file-error", {
                        type: "type",
                        file,
                        accept
                    });
                    return false;
                }
            }
            const sizeMb = file.size / 1024 / 1024;
            let status = true;
            let limitSizeMb = this.size;
            if (templateItem && templateItem[this.mergeValueProps.size]) {
                limitSizeMb = templateItem[this.mergeValueProps.size];
            }
            if (limitSizeMb && sizeMb > limitSizeMb) {
                templateItem.status = "error";
                templateItem.error = "文件大小超限";
                this.$emit("file-error", {
                    type: "size",
                    file,
                    limitSizeMb
                });
                status = false;
            }
            
            let minSizeMb = this.minSize;
            if (templateItem && templateItem[this.mergeValueProps.minSize]) {
                minSizeMb = templateItem[this.mergeValueProps.minSize];
            }
            if (minSizeMb && sizeMb < minSizeMb) {
                templateItem.status = "error";
                templateItem.error = "文件大小不足";
                this.$emit("file-error", {
                    type: "minSize",
                    file,
                    minSizeMb
                });
                status = false;
            }
            return status;
        },

        viewImage(file) {
            // 打开图片预览
            this.currentSrc = file[this.mergeValueProps.url];
            this.currentSrcIsVideo = this._getFileType(file) === 'video';
            this.showReviewBox = true;
        },
        
        downloadFile(file) {
            // 下载文件
            const a = document.createElement("a");
            a.href = file[this.mergeValueProps.url];
            a.download = file[this.mergeValueProps.name];
            a.target = "_blank";
            a.click();
        },
        
        async remoteFile(file, idx) {
            // 删除文件
            if (this.disabled) return;
            if (this.beforeRemove) {
                const status = await promisify(this.beforeRemove, file, idx);
                if (!status) return;
            }
            if (this.mode === 'template') {
                file[this.mergeValueProps.url] = '';
            } else if (this.mode === 'append') {
                this.fileList.splice(idx, 1);
            } else {
                throw new Error('mode配置错误');
            }
            this.outPutValue();
            this.$emit("delete-file", file, idx);
        },

        async onCropped(fileblob) {
            // 裁剪完成
            this.$emit("cropped", fileblob);
            this.currentItem.raw = fileblob;
            await this.prepareToUpload(this.currentItem);
        },
        
        /** 
         * 上传文件：之前需要检查是否允许手动剪裁处理，是否需要强制缩放，是否需要加水印
         */
        async prepareToUpload(fileItem) {
            // 上传文件
            let fileBlob = fileItem.raw;
            if (typeof fileBlob === 'string') {
                // base64
                fileBlob = await fetch(fileBlob).then(res => res.blob());
            }
            if (!this.useCropper) {
                // 是否需要强制缩放
                if (this.useZoom && this.forceZoom) {
                    if(this.zoomFunc){
                        // 使用用户自定义的缩放函数
                        fileBlob = await this.zoomFunc(fileBlob, this.zoomLimit);
                    }else{
                        fileBlob = await zoomImage(fileBlob, this.zoomLimit);
                    }
                }
                // 是否需要加水印
                if (this.useWatermark && (this.watermarkText || this.watermarkFunc)) {
                    fileBlob = await makeWatermark(fileBlob, this.watermarkText, this.watermarkFunc);
                }
            }
            let convertType = getFileFormatToCanvasType(fileItem.name || "");
            if (this.convertExt) {
                convertType = suffixToType(this.convertExt);
                fileItem.name = fileItem.name.replace(/\.\w+$/, `.${this.convertExt}`);
            }
            // 最后一次转换，处理格式和质量 preview
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = URL.createObjectURL(fileBlob);
            const self = this;
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0, img.width, img.height);
                canvas.toBlob((blob) => {
                    fileItem.raw = blob;
                    fileItem.status = 'uploading';
                    // const img = document.createElement('img')
                    // img.src = URL.createObjectURL(fileBlob)
                    // console.log('最后处理完的图片', fileBlob, convertType, fileItem)
                    // document.body.appendChild(img)
                    self.uploadFile(fileItem);
                }, convertType, self.quality);
            };
        },

}

        async uploadFile(fileItem) {
            // 上传文件
            const formData = new FormData();
            formData.append(this.name || "", fileItem.raw, fileItem.name);
            // 上传前检查
            if (this.beforeUpload) {
                const status = await promisify(this.beforeUpload, fileItem);
                if (!status) return;
            }
            
            if (fileItem.status === 'error') {
                return;
            }
            let res = null;
            if (this.uploadFunc) {
                this.uploadLoading = true;
                try {
                    res = await this.uploadFunc(fileItem);
                } catch (error) {
                    fileItem.status = 'error';
                    fileItem.error = error;
                    this.$emit("upload-error", fileItem, error);
                    return;
                } finally {
                    this.uploadLoading = false;
                }
                
            } else if (this.action) {
                this.uploadLoading = true;
                const formData = new FormData();
                formData.append('file', fileItem.raw, fileItem.name);
                if (this.data) {
                    for (let key in this.data) {
                        formData.append(key, this.data[key]);
                    }
                }
                const headers = this.headers || {};
                try {
                    res = await fetch(this.action, {
                        method: 'POST',
                        headers: headers,
                        body: formData
                    }).then(res => res.json());
                } catch (error) {
                    fileItem.status = 'error';
                    fileItem.error = error;
                    this.$emit("upload-error", fileItem, error);
                    return;
                } finally {
                    this.uploadLoading = false;
                }
            } else {
                throw new Error('请配置uploadFunc或者action');
            }
            const url = getObjectValueByPath(res, this.responseSrcPath, null);
            if (!url) {
                throw new Error('上传失败，未获取到url，请检查responseSrcPath配置或者接口返回');
            }
            fileItem.status = 'success';
            fileItem[this.mergeValueProps.url] = url;
            fileItem[this.mergeValueProps.name] = fileItem.name;
            this.$emit("upload-success", fileItem, res, this.fileList);
            if (this.mode === 'append') {
                this.fileList.push(fileItem);
            }
            this.outPutValue();
            this.showCropper = false;
        }
    }
}

</script>
<style lang="scss">
@import './style.scss'
</style>