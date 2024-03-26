import {config as $config } from './lib/config.js';
import ipage from './lib/IPage.vue';
import iSearch from './lib/ISearch.vue';
import iTable from './lib/ITable.vue';
import iForm from './lib/IForm.vue';
import iTableColumn from './lib/components/ITableColumn.vue';
import renderCell from './lib/components/RenderCell.vue';
import splitDownloadAndExport from './lib/components/SplitDownloadAndExport.vue';
import renderSelectLoadmore from './lib/components/RenderSelectLoadmore.vue';
export const config = $config
export const IPage = ipage
export const RenderCell = renderCell
export const ISearch = iSearch
export const ITable = iTable
export const IForm = iForm
export const ITableColumn = iTableColumn
export const SplitDownloadAndExport = splitDownloadAndExport
export const RenderSelectLoadmore = renderSelectLoadmore

const components = {IPage,RenderCell,ISearch,ITable,IForm,ITableColumn,SplitDownloadAndExport,RenderSelectLoadmore};

const install = function (Vue) {
    Object.keys(components).forEach(key=>{
        const component = components[key];
        Vue.component(component.name||key, component);
    });
};

// 判断是否是直接引入文件，如果是，则自动安装组件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    config:$config,
    ...components,
};