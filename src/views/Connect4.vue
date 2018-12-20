<template>
    <div>
        <div v-if="!$store.state.gameOn">
            <h3>Game not started</h3>
        </div>
        <div v-else>
            <h3 v-if="currentPlayer.auto">{{currentPlayer.name}} is an auto player, please click any column to continue</h3>
            <h3 v-else>{{currentPlayer.name}} are you ready? Please click the column to play</h3>
        </div>
        <br><br>
        <div v-if="$store.state.gameOn">
            <div v-for="(n, i) in nrow" :key="i+'row'">
                <span 
                    v-for="(m, j) in ncol" 
                    :key="j+'col'" 
                    :style="{'background-color': getColor(n - 1, m - 1)}"
                    class="dot"
                    @click="play(m-1)"
                ></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'connect4',
    data: () => {
        return {
            loading: false
        }
    },
    computed: {
        nrow(){
            return this.$store.state.nrow;
        },
        ncol(){
            return this.$store.state.ncol;
        },
        currentPlayer(){
            return this.$store.getters.currentPlayer;
        }
    },
    methods: {
        getColor(i, j){
            let color = this.$store.state.grid[i][j].color;
            return color ? color : '#bbb';
        },
        play(col){
            if(this.loading){
                return alert("Please wait");
            }
            let {name, color, auto, level} = this.currentPlayer;
            this.$store.dispatch('play', {
                col, name, color, auto, level
            }).then(res => {
                if(!res.filled){
                    return;
                }
                if(res.win){
                    alert(`Game Over, ${name} win!`);
                    this.$store.dispatch("updateLog", `Game Over, ${name} win!`);
                    this.$store.dispatch("gameOver");
                    this.$router.push({ name: 'home' });
                }
                if(res.isFull){
                    alert(`Game Over, No one wins.`);
                    this.$store.dispatch("updateLog", `Game Over, No one wins.`);
                    this.$store.dispatch("gameOver");
                    this.$router.push({ name: 'home' });
                }
                this.$store.dispatch("updateLog", JSON.stringify(res));
                this.loading = false;
                this.$forceUpdate();
            });
        }
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