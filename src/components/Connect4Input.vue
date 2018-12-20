<template>
    <div>
        <div>
            <h3>Players ({{players.length}}):</h3>
            <ul>
                <li v-for="({name, color, auto}, i) in players" :key="i">
                    <p :style="{color: color}">{{name}} ({{auto ? 'Auto' : 'Manual'}})</p>
                </li>
            </ul>
        </div>
        <div v-show="players.length < 5">
            <h3>Add Player</h3>
            <div>
                <label >name: </label>
                <input type="text" v-model = "name">
                <label >color: </label>
                <select v-model="color">
                    <option v-for="(color, i) in remainColors" :key="i">{{color}}</option>
                </select>
                <input type="checkbox" v-model="auto">
                <label>Auto</label>
                <button @click="add">add</button>
            </div>
        </div>
        <br><br><br><br><br><br>
        <div v-if="players.length >= 2">
            <button @click="startGame">Start Game !</button>
        </div>
    </div>
</template>


<script>
export default {
    name: 'Connect4Input',
    data: () => {
        return {
            name: "",
            color: "",
            auto: false,
            colors: ['red', 'blue', 'green', 'yellow', 'black'],
            players: []
        }
    },
    computed: {
        remainColors(){
            return this.colors.reduce((accu, curr) => {
                const found = this.players.some(({color}) => curr === color);
                if (!found){
                    accu.push(curr);
                }
                return accu;
            }, []);
        }
    },
    methods: {
        cleanForm(){
            this.name = "";
            this.color = "";
            this.auto = false;
        },
        add(){
            if(!this.name || !this.color){
                return alert("name and color can not be empty!");
            }
            if(this.players.length >= 5){
                return alert("reached max number of players (5)!");
            }
            this.players.push({
                name: this.name,
                color: this.color,
                auto: this.auto
            });
            this.cleanForm();
        },
        startGame(){
            if(this.$store.state.gameOn){
                this.$router.push({ name: 'connect4' });
                return alert("please finish the game.");
            }
            if(this.players.length < 2){
                return alert("you need at least 2 players to play.")
            }
            this.$store.dispatch("startGame", {
                players: this.players, 
                dimensions:{
                    nrow: 10,
                    ncol: 20
                }
            });
            this.$router.push({ name: 'connect4' });
        }
    }
    
}
</script>
