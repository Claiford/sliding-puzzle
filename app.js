const swapTileContent = (tile1, tile2) => {
    console.log("swapping");
    tile1.append(tile2.querySelector("p"));
    tile2.append(tile1.querySelector("p"));

    emptyTileID = tile1.id;
};

const clickTile = (event) => {
    ///// check if any adjacent tile is empty, if so swap content /////
    const thisTile = event.currentTarget;
    const thisTileRow = Number(thisTile.id.split("")[4]);
    const thisTileCol = Number(thisTile.id.split("")[5]);
    console.log(thisTileRow, thisTileCol);
    
    // top tile
    const topTile = document.querySelector(`#tile${thisTileRow - 1}${thisTileCol}`);
    if ((topTile) && topTile.id === emptyTileID) swapTileContent(thisTile, topTile);
    
    // right tile
    const rightTile = document.querySelector(`#tile${thisTileRow}${thisTileCol + 1}`);
    if ((rightTile) && rightTile.id === emptyTileID) swapTileContent(thisTile, rightTile);
    
    // bottom tile
    const bottomTile = document.querySelector(`#tile${thisTileRow + 1}${thisTileCol}`);
    if ((bottomTile) && bottomTile.id === emptyTileID) swapTileContent(thisTile, bottomTile);
    
    // left tile
    const leftTile = document.querySelector(`#tile${thisTileRow}${thisTileCol - 1}`);
    if ((leftTile) && leftTile.id === emptyTileID) swapTileContent(thisTile, leftTile)
};

const shuffleBoard = () => {
    ///// randomise 50 moves from initial complete board /////\
    for (let i = 0; i < 50; i++) {
        const emptyTileRow = Number(emptyTileID.split("")[4]);
        const emptyTileCol = Number(emptyTileID.split("")[5]);
        adjacentTiles = [];

        //top tile
        const topTile = document.querySelector(`#tile${emptyTileRow - 1}${emptyTileCol}`);
        if (topTile) adjacentTiles.push(topTile);

        // right tile
        const rightTile = document.querySelector(`#tile${emptyTileRow}${emptyTileCol + 1}`);
        if (rightTile) adjacentTiles.push(rightTile);
        
        // bottom tile
        const bottomTile = document.querySelector(`#tile${emptyTileRow + 1}${emptyTileCol}`);
        if (bottomTile) adjacentTiles.push(bottomTile);
        
        // left tile
        const leftTile = document.querySelector(`#tile${emptyTileRow}${emptyTileCol - 1}`);
        if (leftTile) adjacentTiles.push(leftTile);

        // select random tile from adjacentTiles
        randomIndex = Math.floor(Math.random() * adjacentTiles.length);
        console.log(randomIndex);
        adjacentTiles[randomIndex].click();
    }
}

const getTileContent = (height, width) => {
    tileTotal = height * width;
    content = []
    for (let i = 1; i < tileTotal + 1; i++) {
        content.push(i);
    }
    content[tileTotal - 1] = ""
    return content;
};

const createBoard = (height, width) => {
    const grid = Array.from(Array(height), () => new Array(width));

    const content = getTileContent(height, width);
    let contentIndex = 0;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.classList.add(`tile-width${width}`);
            newTile.id = `tile${i}${j}`;
            newTile.addEventListener('click', clickTile);
    
            const tileContent = document.createElement("p");
            tileContent.innerText = content[contentIndex];
            contentIndex++;
            newTile.append(tileContent);
    
            document.querySelector(".grid").append(newTile);

            grid[i][j] = tileContent.innerText;

            if (tileContent.innerText === "") emptyTileID = newTile.id;
        }
    }
    return grid;
};

let emptyTileID = "";
const grid = createBoard(3,3)
shuffleBoard();
console.log(grid);
console.log(emptyTileID);
