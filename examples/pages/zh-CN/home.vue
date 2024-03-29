<template>
    <div class="home-page">
        <div class="welcome">
            <h3 class="center">高阶Element UI封装库</h3>
            <ul class="core-function">
                <li>快速的完成<span class="eye-catching">增删改查</span>等常规页面</li>
                <li>用json数据和业务代码，动态渲染表单</li>
                <li>ISearch: 用于生成多参数搜索栏</li>
                <li>ITable: 用于展示数据表</li>
                <li>IForm: 用于动态表单</li>
                <li>IPage: 一个常规布局的<span class="eye-catching">增删改查</span>页面</li>
                
            </ul>
            <div class="start-button-box">
                <div class="card">
                    <h3>指南</h3>
                    <p>快速安装部署。</p>
                    <a href="#/zh-CN/guide" class="">查看详情</a>
                </div>
                <div class="card">
                    <h3>组件</h3>
                    <p>使用组件 Demo 快速体验交互细节；使用前端框架封装的代码帮助工程师快速开发。</p>
                    <a href="#/zh-CN/component" class="">查看详情</a>
                </div>
                <div class="card">
                    <h3>全局配置</h3>
                    <p>使用全局配置，定义样式，默认行为和扩展组件。</p>
                    <a href="#/zh-CN/config" class="">查看详情</a>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">

    
.home-page {
    padding: 20px;
    padding-bottom: 50px;
    display: flex;
    flex: 1;
    .welcome {
        font-size: 16px;
        color: #555;
        margin: 0 auto;
        width: 80%;
        .center {
            font-size: 20px;
            color: #333;
            text-align: center;
        }
        .core-function {
            display: flex;
            flex-direction: column;
            line-height: 1.8;
        }
    }
    .eye-catching {
        color: #f90;
    }
    .start-button-box {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 58px;
    }
}

.card {
    height: 260px;
    width: 100%;
    background: #fff;
    border: 1px solid #eaeefb;
    border-radius: 5px;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    transition: all .3s ease-in-out;
    bottom: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    a {
        height: 53px;
        line-height: 52px;
        font-size: 14px;
        color: #409eff;
        text-align: center;
        border: 0;
        border-top: 1px solid #eaeefb;
        padding: 0;
        cursor: pointer;
        width: 100%;
        background-color: #fff;
        border-radius: 0 0 5px 5px;
        transition: all .3s;
        text-decoration: none;
        display: block;
        &:hover {
            color: #fff;
            background: #409eff;
        }
    }
}
.card:hover {
    bottom: 6px;
    box-shadow: 0 6px 18px 0 rgba(232,237,250,.5);
}
</style>