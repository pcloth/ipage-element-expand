import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const defaultOptions = {
    viewMode: 1,
    aspectRatio: 16 / 9, // 裁剪比例 false
    zoomable: true, // 是否缩放
    zoomOnTouch: true,
    zoomOnWheel: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
    autoCrop: true, // 是否在初始化时允许自动剪裁图片
    background: true, // 是否在容器上显示网格背景
    highlight: true, // 是否在剪裁框上显示白色的模态窗口
    center: true,
    responsive: true, // 是否在窗口尺寸改变的时候重置cropper
    restore: true,
    checkCrossOrigin: true,
    checkOrientation: true,
    scalable: true,
    modal: true, // 是否在剪裁框上显示黑色的模态窗口
    guides: true, // 裁剪框的虚线(九宫格)
    movable: true, // 是否允许移动图片
    rotatable: true // 是否允许旋转图片
};

export default {
    name: "ReCropper",
    props: {
        src: {
            type: String,
            required: true
        },
        alt: {
            type: String
        },
        width: {
            type: [String, Number],
            default: ""
        },
        height: {
            type: [String, Number],
            default: "360px"
        },
        crossorigin: {
            type: [String, Object],
            default: "anonymous"
        },
        imageStyle: {
            type: Object,
            default() {
                return {};
            }
        },
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            cropper: null,
            isReady: false
        };
    },
    computed: {
        getImageStyle() {
            return {
                height: this.height,
                width: this.width,
                maxWidth: "100%",
                ...this.imageStyle
            };
        },
        getWrapperStyle() {
            const { height, width } = this;
            return {
                width: `${width}`.replace(/px/, "") + "px",
                height: `${height}`.replace(/px/, "") + "px"
            };
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
        });
    },
    methods: {
        init() {
            const imgEl = this.$refs.imgElRef;
            if (!imgEl) {
                return;
            }
            imgEl.addEventListener("cropend", (e) => {
                this.$emit("crop-end", e);
            });
            imgEl.addEventListener("crop", (e) => {
                this.$emit("crop", e);
            });
            this.cropper = new Cropper(imgEl, {
                ...defaultOptions,
                ready: () => {
                    this.isReady = true;
                },
                ...this.options
            });
        }
    },
    render(h) {
        return h('div', {
            style: this.getWrapperStyle,
            attrs: {
                class: 'vue-cropper'
            }
        }, [
            h('img', {
                ref: 'imgElRef',
                attrs: {
                    src: this.src,
                    alt: this.alt,
                    crossorigin: this.crossorigin
                },
                style: this.getImageStyle
            })
        ]);
    }
};
