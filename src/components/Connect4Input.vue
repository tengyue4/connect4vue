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
                <div>
                    <label >name: </label>
                    <input type="text" v-model = "name">
                </div>
                <br>
                <div>
                    <label >color: </label>
                    <select v-model="color">
                        <option v-for="(color, i) in remainColors" :key="i">{{color}}</option>
                    </select>
                </div>
                <br>
                <div>
                    <input type="checkbox" v-model="auto">
                    <label>Auto (Play by computer)</label>
                </div>
                <br>
                <div v-if="auto">
                    <label >level: </label>
                    <select v-model="level">
                        <option :value="0">Naive</option>
                        <option :value="1">Median</option>
                        <option :value="2">Defensive</option>
                    </select>
                </div>
                <br>
                <button @click="add">add</button>
            </div>
        </div>
        <br><br><br><br><br><br>
        <div v-if="players.length >= 2">
            <label >rows: </label>
            <input type="number" step="1" min="10" v-model = "rows">
            <label >columns: </label>
            <input type="number" step="1" min="10" v-model = "cols">
            <button @click="startGame">Start Game !</button>
        </div>
        <hr>
        <h3>Recent Winners:</h3>
        <div>
            <p v-for="(winner, i) in winners" :key="i+'winner'">{{new Date(winner.datetime).toLocaleString()}}   ||   {{winner.name}}</p>
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
            level: 0,
            rows: 10,
            cols: 10,
            colors: ['red', 'blue', 'green', 'yellow', 'black'],
            players: [],
            winners: []
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
            this.level = 0;
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
                auto: this.auto,
                level: this.level
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
            let nrow = Math.floor(this.rows);
            let ncol = Math.floor(this.cols);
            if(nrow < 10 || nrow > 30 || ncol < 10 || ncol > 30){
                return alert("illegal dimensions. rows/cols should between 10 and 30");
            }
            this.$store.dispatch("startGame", {
                players: this.players, 
                dimensions:{nrow, ncol}
            });
            this.$router.push({ name: 'connect4' });
        }
    },
    created(){
        this.$store.dispatch("listWinners")
        .then(res => {
            res.data.sort((a, b) => b.datetime - a.datetime);
            this.winners = res.data;
        })
        
    }
    
}
</script>
