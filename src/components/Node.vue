<template>
    <span 
        class="dot"
        :style="{color: color}"
    ></span>
</template>

<script>
export default {
    name: 'Node',
    props: ['row', 'col'],
    data: () => {
        return {
            color: '#bbb'
        }
    },
    methods: {
        refresh(){
            this.color = this.$store.state.grid[this.row-1][this.col-1];
        }
    },
    created(){
        this.refresh();
    }
}
</script>


<style scoped>
.dot {
    height: 25px;
    width: 25px;
    margin-left: 4px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
}
</style>