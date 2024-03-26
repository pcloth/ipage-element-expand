<template>
    <div class="main-container">
        <div class="left-menus">
            <side-nav :data="navsData[lang]" :base="`/${ lang }/docs`"></side-nav>
        </div>
        <div class="page-component">
            <router-view />
        </div>
    </div>
</template>

<script>
import navsData from '../nav.config.json';
import SideNav from './side-nav.vue'
export default {
    components:{
        SideNav
    },
    data(){
        return {
            navsData,
            lang: this.$route.meta.lang,
        }
    }
};
</script>

<style>
</style>