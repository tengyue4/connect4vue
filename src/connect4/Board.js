

export class Board {
    constructor(nrow, ncol){
        this.nrow = nrow;
        this.ncol = ncol;
        this.maxSteps = nrow * ncol;
        this.grid = new Array(nrow).fill(0).map(_ => new Array(ncol).fill({
            filled: false,
            playerId: null
        }));
    }

    getNextRow(col){
        // if the column is out of range
        if(col < 0 || col >= this.ncol){
            return -1;
        }
        // use binary search to get the empty row
        let start = 0, end = this.nrow - 1;
        while(start + 1 < end){
            let mid = start + Math.floor((end - start)/2);
            if(this.grid[mid][col].filled){
                end = mid;
            }else{
                start = mid;
            }
        }
        if(!this.grid[end][col].filled){
            return end;
        }
        if(!this.grid[start][col].filled){
            return start;
        }
        return -1;
    }

    is4Connected(row, col){
        const playerId = this.grid[row][col].playerId;
        const slopes = [
            [[-1, 0], [1, 0]],
            [[0, -1], [0, 1]],
            [[1, -1], [-1, 1]],
            [[-1, -1], [1, 1]]
        ];
        return slopes.some(directions => {
            const numConnected = directions.reduce((counter, [dx, dy]) => {
                let x = row, y = col;
                while(
                    x + dx >= 0 && x + dx < this.nrow &&
                    y + dy >= 0 && y + dy < this.ncol &&
                    this.grid[x][y].filled && this.grid[x][y].playerId === playerId
                ){
                    x += dx;
                    y += dy;
                    counter++;
                }
                return counter;
            }, 1);
            return numConnected >= 4;
        });
    }

    fill(col, playerId){
        // check if the grid to fill is valid
        const row = this.getNextRow(col);
        if(row === -1){
            return {
                filled: false,
                isFull: false,
                win: false
            };
        }
        // fill the grid
        this.grid[row][col] = {
            filled: true,
            playerId
        };
        // check if the player wins and return
        return {
            filled: true,
            isFull: --this.maxSteps === 0,
            win: this.is4Connected(row, col)
        };
    }
}
