<template>
    <div class="main-container">
        <div class="left-menus">
            <side-nav :data="menus" :base="basePath"></side-nav>
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
    },
    computed:{
        menuObj(){
            const path = '/'+this.$route.path.split('/')[2]
            const obj = navsData[this.lang].find(nav => nav.path === path)
            return obj
        },
        menus(){
            if(this.menuObj){
                return [this.menuObj]
            }
            return []
        },
        basePath(){
            return "/"
            if(this.menuObj){
                return this.menuObj.path
            }
            return "/"
        }
    },
    mounted(){
        window.tt = this;
        // path: "/zh-CN/docs/quickstart"
        
    }
};
</script>

<style>
</style>