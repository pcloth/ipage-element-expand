<template>
    <div class="main-header">
        <div class="main-container clearfix">
            <div class="f-left">
                <navs :menus="navs" />
            </div>
            <div class="f-right">
                <!-- 语言选择器 -->
                <!-- <li class="nav-item lang-item"> -->
                    <el-dropdown trigger="click" class="nav-dropdown nav-lang" :class="{ 'is-active': langDropdownVisible }">
                        <span>
                            {{ displayedLang }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" class="nav-dropdown-list" @input="handleLangDropdownToggle">
                            <el-dropdown-item v-for="(value, key) in langs" :key="key" @click.native="switchLang(key)">
                                {{ value }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                <!-- </li> -->
                <navs :menus="outside" />
            </div>
        </div>
    </div>
</template>
<script>
import Navs from "./navs";
let userLanguage =
    localStorage.getItem("ELEMENT_LANGUAGE") ||
    window.navigator.language ||
    "zh-CN";
// import compoLang from "../i18n/component.json";
export default {
    components: { Navs },
    data() {
        return {
            userLanguage: userLanguage,
            navs: [
                { label: "首页", router: "/" },
                { label: "文档", router: `/${userLanguage}/docs` }
            ],
            outside: [
                { label: "Github", link: this.$root.pkg.github },
                { label: "About", link: this.$root.pkg.website },
            ],
            active: "",
            verDropdownVisible: true,
            langDropdownVisible: true,
            langs: {
                "zh-CN": "中文",
                "en-US": "English",
            },
        };
    },
    computed: {
        lang() {
            return this.$route.path.split("/")[1] || "zh-CN";
        },
        displayedLang() {
            return this.langs[this.lang] || "中文";
        },
        // langConfig() {
        //     return compoLang.filter((config) => config.lang === this.lang)[0][
        //         "header"
        //     ];
        // },
        isComponentPage() {
            return /^component/.test(this.$route.name);
        },
        isHome() {
            return /^home/.test(this.$route.name);
        },
    },
    methods: {
        switchLang(targetLang) {
            if (this.lang === targetLang) return;
            localStorage.setItem("ELEMENT_LANGUAGE", targetLang);
            this.$router.push(this.$route.path.replace(this.lang, targetLang));
        },
        handleLangDropdownToggle(visible) {
            this.langDropdownVisible = visible;
        },
    },
    created() {},
};
</script>

<style lang="scss">
.f-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
}
.f-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
