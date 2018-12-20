

export class Player {
    constructor(name, color, id, board){
        this.name = name;
        this.color = color;
        this.id = id;
        this.board = board;
    }

    play(col){
        return this.board.fill(col, this.id);
    }
}
