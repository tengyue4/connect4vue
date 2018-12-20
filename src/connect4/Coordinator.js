import { Board } from './Board';
import { Player } from './Player';

export class Coordinator{
    constructor(nrow, ncol, players){
        this.board = new Board(nrow, ncol);
        this.players = players.map(({name, color}, index) => new Player(name, color, index + 1, this.board));
        this.cursor = 0;
    }

    nextRound(col){
        let res = this.players[this.cursor % this.players.length].play(col);
        this.cursor++;
        return res;
    }
}

