import Vue from 'vue'
import Vuex from 'vuex'
import { Coordinator } from './connect4/Coordinator'
import { 
    findRow, is4Connected, findCellNaive, findCellMedian, findCellDefensive
} from './util'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        gameOn: false,
        players: [],
        logs: [],
        nrow: 10,
        ncol: 10,
        cursor: 0,
        grid: []

    },
    getters: {
        currentPlayer: ({players, cursor}) => {
            if(players.length){
                let {name, color, auto, level} = players[cursor % players.length];
                return {name, color, auto, level};
            }else{
                return {name: null, color: null, auto: null, level: null};
            }
        }
    },
    mutations: {
        mutateGame (state, status) {
            state.gameOn = status;
            state.logs.unshift(JSON.stringify({
                time: new Date(),
                message: `Game status changed to ${status}`
            }))
        },
        mutatePlayers (state, players) {
            state.players = JSON.parse(JSON.stringify(players));
            state.logs.unshift(JSON.stringify({
                time: new Date(),
                message: `Initialized players`
            }))
        },
        setupBoard (state, payload) {
            const {nrow, ncol} = payload;
            state.nrow = nrow;
            state.ncol = ncol;
            state.grid = new Array(nrow).fill(0).map(_ => new Array(ncol).fill(0).map(_ => {
                return {
                    filled: false,
                    color: null
                }
            }));
            state.logs.unshift(JSON.stringify({
                time: new Date(),
                message: `Game Board setup`
            }))
        },
        markPlayer (state, payload) {
            let {row, col, color, name} = payload;
            state.grid[row][col].filled = true;
            state.grid[row][col].color = color;
            state.logs.unshift(JSON.stringify({
                time: new Date(),
                message: `Player ${name} marked row: ${row}, column: ${col} with color: ${color}`
            }))
        },
        setCursor (state, val) {
            state.cursor = val;
            state.logs.unshift(JSON.stringify({
                time: new Date(),
                message: `Number of steps: ${val}`
            }))
        },
        resetGame (state) {
            state.gameOn = false;
            state.players = [];
            state.nrow = 10;
            state.ncol = 10;
            state.cursor = 0;
            state.grid = [];
            state.logs.unshift(JSON.stringify({
                time: new Date(),
                message: `Game has been reset`
            }))
        },
        pushLog (state, message) {
            state.logs.unshift(JSON.stringify({
                time: new Date(),
                message
            }))
        }

    },
    actions: {
        startGame ({ commit }, payload) {
            let {players, dimensions} = payload;
            commit('mutatePlayers', players);
            commit('setupBoard', dimensions);
            commit('mutateGame', true);
            commit('setCursor', 0);
        },
        gameOver ({ commit }) {
            commit('resetGame');
        },
        
        play ({ state, commit }, payload){
            let {color, name, col, auto, level} = payload;
            let row = findRow(state.grid, col, state.nrow, state.ncol);
            if(auto){
                let cell;
                if(level == 0){
                    cell = findCellNaive(state.grid, color);
                }else if(level == 1){
                    cell = findCellMedian(state.grid, color);
                }else if(level == 2){
                    let index = state.players.findIndex(player => player.color === color);
                    let len = state.players.length;
                    let nextColor = state.players[(index + 1) % len].color;
                    cell = findCellDefensive(state.grid, color, nextColor);
                }
                row = cell.row;
                col = cell.col;
            }
            if (row === -1){
                return {filled: false, isFull: state.cursor == state.ncol * state.nrow, win: false, row};
            }
            commit("markPlayer", {row, col, color, name});
            commit('setCursor', state.cursor + 1);
            return {
                filled: true, 
                isFull: state.cursor == state.ncol * state.nrow, 
                win: is4Connected(state.grid, row, col, state.nrow, state.ncol), 
                row
            };
        },

        updateLog({commit}, message){
            commit("pushLog", message);
        }
    }
})
