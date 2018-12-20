const findCell = function(grid, col, nrow, ncol){
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


const autoFindCell = function(grid, color){
    let nrow = grid.length;
    let ncol = grid[0].length;
    let col = Math.floor(Math.random() * ncol);
    let row = findCell(grid, col, nrow, ncol)
    while(row === -1){
        col = Math.floor(Math.random() * ncol);
        row = findCell(grid, col, nrow, ncol);
    }
    return {row, col};
}


export {
    findCell, is4Connected, autoFindCell
}