import Vue from 'vue'
import App from './App.vue'
import DemoBlock from './components/demo-block.vue'
import router from './router'
import Component from '../src'
import {config} from '../src'
import hljs from 'highlight.js';
import pkg from '../package.json'

import 'highlight.js/styles/color-brewer.css'
import './assets/main.less'
import './demo-styles/index.scss';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.component(DemoBlock.name || 'DemoBlock', DemoBlock)
Vue.use(Component)

config.set({
    extendedRenderCell:{
        demo:(h)=><el-button>demo</el-button>,
    }
})


Vue.config.productionTip = false
router.afterEach(() => {
    Vue.nextTick(() => {
        const blocks = document.querySelectorAll('pre code:not(.hljs)');
        Array.prototype.forEach.call(blocks, hljs.highlightBlock);
    });
});

const app = new Vue({
    render: h => h(App),
    router,
    data() {
        return {
            pkg: pkg
        }
    }
}).$mount('#app')
window.app = app
