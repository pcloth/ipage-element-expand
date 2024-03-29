const Config = require('markdown-it-chain');
const anchorPlugin = require('markdown-it-anchor');
const slugify = require('transliteration').slugify;
const containers = require('./containers');
const overWriteFenceRule = require('./fence');
const tocPlugin = require('markdown-it-toc-done-right');
const config = new Config();
const bus = {}
config
    .options.html(true).end()
    .plugin('anchor').use(anchorPlugin, [
        {
            level: 2,
            slugify: slugify,
            permalink: true,
            permalinkBefore: true
        }
    ]).end()
    .plugin('containers').use(containers).end()
    .plugin('toc').use(tocPlugin, [
        {
            slugify: slugify,
            includeLevel: [2, 3],
            callback:(html)=>{
                if(html.length>37){
                    // <nav class="table-of-contents"></nav> 不记录这种空的，避免递归查询覆盖到文档
                    bus.menus = html 
                }
            }
        }
    ]).end();

const md = config.toMd();
md.bus = bus
overWriteFenceRule(md);
module.exports = md;
