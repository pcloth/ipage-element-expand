<template>
    <div class="main-container-doc">
        <div class="left-menus">
            <side-nav :data="menus" :base="`/${lang}`"></side-nav>
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
        }
    },
    mounted(){
        window.tt = this;
        // path: "/zh-CN/docs/quickstart"
        
    }
};
</script>

<style lang="scss">
.main-container-doc {
    box-sizing: border-box;
    width: 100%;
    padding: 20px 40px 20px 40px;
    display: flex;
    flex: 1;
}
</style>