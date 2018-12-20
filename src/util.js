const findRow = function(grid, col, nrow, ncol){
    // if the column is out of range
    if(col < 0 || col >= ncol){
        return -1;
    }
    // use binary search to get the empty row
    let start = 0, end = nrow - 1;
    while(start + 1 < end){
        let mid = start + Math.floor((end - start)/2);
        if(grid[mid][col].filled){
            end = mid;
        }else{
            start = mid;
        }
    }
    if(!grid[end][col].filled){
        return end;
    }
    if(!grid[start][col].filled){
        return start;
    }
    return -1;
}


const maxNumConnected = function(grid, row, col, color){
    const nrow = grid.length;
    const ncol = grid[0].length;
    const slopes = [
        [[-1, 0], [1, 0]],
        [[0, -1], [0, 1]],
        [[1, -1], [-1, 1]],
        [[-1, -1], [1, 1]]
    ];
    return slopes.reduce((maxConnected, directions) => {
        const numConnected = directions.reduce((counter, [dx, dy]) => {
            let x = row, y = col;
            while(
                x + dx >= 0 && x + dx < nrow &&
                y + dy >= 0 && y + dy < ncol &&
                grid[x + dx][y + dy].filled && grid[x + dx][y + dy].color === color
            ){
                x += dx;
                y += dy;
                counter++;
            }
            return counter;
        }, 1);
        return numConnected > maxConnected ? numConnected : maxConnected;
    }, 0);
}


const is4Connected = function(grid, row, col, nrow, ncol){
    const color = grid[row][col].color;
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
                x + dx >= 0 && x + dx < nrow &&
                y + dy >= 0 && y + dy < ncol &&
                grid[x + dx][y + dy].filled && grid[x + dx][y + dy].color === color
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


const findCellNaive = function(grid, color){
    let nrow = grid.length;
    let ncol = grid[0].length;
    let col = Math.floor(Math.random() * ncol);
    let row = findRow(grid, col, nrow, ncol)
    while(row === -1){
        col = Math.floor(Math.random() * ncol);
        row = findRow(grid, col, nrow, ncol);
    }
    return {row, col};
}

const findCellMedian = function(grid, color){
    let nrow = grid.length;
    let ncol = grid[0].length;
    return [...Array(ncol).keys()].reduce((accu, col) => {
        const row = findRow(grid, col, nrow, ncol);
        if(row === -1){
            return accu;
        }
        let numConnected = maxNumConnected(grid, row, col, color);
        if(numConnected <= accu.numConnected){
            return accu;
        }else{
            return { numConnected, row, col };
        }
    }, {numConnected: 0, row: -1, col: -1});
}

const findCellDefensive = function(grid, color, nextColor){
    let mycell = findCellMedian(grid, color);
    if(mycell.numConnected >= 4){
        return {row: mycell.row, col: mycell.col};
    }
    let othercell = findCellMedian(grid, nextColor);
    if(othercell.numConnected < 4){
        return {row: mycell.row, col: mycell.col};
    }
    return {row: othercell.row, col: othercell.col};
}


export {
    findRow, is4Connected, findCellNaive, findCellMedian, findCellDefensive
}