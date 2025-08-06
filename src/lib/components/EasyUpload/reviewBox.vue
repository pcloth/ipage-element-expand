<template>
    <div class="easy-upload-reviewbig-box" :style="{
        zIndex: props.zIndex
    }" v-if="props.show">
        <!-- 全屏预览图片: 一个mask蒙层，一个预览区域弹窗，一个关闭 -->
        <div class="easy-upload-reviewbig-mask" @click="closeBigReview"></div>
        <div class="easy-upload-reviewbig-content" :style="{
            width: props.width,
            height: props.height
        }">
            <div class="easy-upload-reviewbig-content-close" @click="closeBigReview">
                <img src="./images/close.png" alt="">
            </div>
            <div class="easy-upload-reviewbig-content-image"
            :style="{
                height: props.height
            }"
            >
                <video class="video-review" v-if="props.isVideo" :src="props.src" controls></video>
                <img class="image-review" v-else :src="props.src" alt="">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
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
})
const emit = defineEmits([
    'update:show'
])
const closeBigReview = () => {
    emit('update:show', false)
}
</script>

<style lang="scss">
</style>