<template>
    <div class="easy-upload-reviewbig-box" :style="{
        zIndex: zIndex
    }" v-if="show">
        <!-- 全屏预览图片: 一个mask蒙层，一个预览区域弹窗，一个关闭 -->
        <div class="easy-upload-reviewbig-mask" @click="closeBigReview"></div>
        <div class="easy-upload-reviewbig-content" :style="{
            width: width,
            height: height
        }">
            <div class="easy-upload-reviewbig-content-close" @click="closeBigReview">
                <img src="./images/close.png" alt="">
            </div>
            <div class="easy-upload-reviewbig-content-image" :style="{
                height: height
            }">
                <video class="video-review" v-if="isVideo" :src="src" controls></video>
                <img class="image-review" v-else :src="src" alt="">
            </div>
        </div>
    </div>
</template>

<script lang="js">
export default {
    props: {
        src: {
            type: String,
            default: ''
        },
        isVideo: {
            type: Boolean,
            default: false
        },
        show: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '700px'
        },
        height: {
            type: String,
            default: '550px'
        },
        zIndex: {
            type: Number,
            default: 2500
        }
    },
    methods: {
        closeBigReview() {
            this.$emit('update:show', false);
        },

    }
}
</script>

<style lang="scss"></style>