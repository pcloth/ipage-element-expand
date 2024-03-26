<script lang="jsx">

export default {
    name: "Renderer",
    props: {
        render: {
            type: [Function,Object]
        },
        params: {
            type: Object
        },
    },
    render() {
        if(typeof this.render==='function'){
            return this.render(this.params)
        }
        return this?.render
    }
};
</script>