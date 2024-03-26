<template>
    <div id="app">
        <!-- <test/> -->
        <MainHeader />
        <router-view />
        <MainFooter />
    </div>
</template>

<script>
import MainHeader from "./components/main-header";
import MainFooter from "./components/main-footer";
// import test from "./docs/components/test.vue";
export default {
    name: "app",
    components: {
        MainHeader,
        MainFooter,
        // test
    },
};
</script>
