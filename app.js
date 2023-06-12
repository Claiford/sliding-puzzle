const checkWin = () => {
    ///// loop through gameGrid and check if img IDs are in ascending order /////
    let isWin = true;
    let prevNum = gameGrid[0][0];
    for (let row of gameGrid) {
        for (let tileNum of row) {
            if (tileNum < prevNum) {
                isWin = false;
                break;
            }
            prevNum = tileNum;
        }
    }
    return isWin;
}

const swapTileContent = (filledTile, emptyTile) => {
    filledTile.append(emptyTile.querySelector("p"));
    emptyTile.append(filledTile.querySelector("p"));

    const temp = gameGrid[filledTile.id[4]][filledTile.id[5]];
    gameGrid[filledTile.id[4]][filledTile.id[5]] = gameGrid[emptyTile.id[4]][emptyTile.id[5]];
    gameGrid[emptyTile.id[4]][emptyTile.id[5]] = temp;

    emptyTileID = filledTile.id;
    console.log(gameGrid);
};

const clickTile = (event) => {
    ///// check if any adjacent tile is empty, if so swap content /////
    const thisTile = event.currentTarget;
    const thisTileRow = Number(thisTile.id[4]);
    const thisTileCol = Number(thisTile.id[5]);
    
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

    // check winning condition
    if (gameStart && checkWin()) {
        console.log("WINNER");
        endBoard();
    }
};

const endBoard = () => {
    const allTiles = document.querySelectorAll(".tile");
    for (let tile of allTiles) {
        tile.removeEventListener('click', clickTile);
    }

    const finalTileContent = document.querySelector(`#${emptyTileID} p`);
    finalTileContent.innerText = gameGrid[emptyTileID[4]][emptyTileID[5]];
}

const shuffleBoard = () => {
    ///// randomise 100 moves from initial complete board /////
    for (let i = 0; i < 100; i++) {
        const emptyTileRow = Number(emptyTileID[4]);
        const emptyTileCol = Number(emptyTileID[5]);
        const adjacentTiles = [];

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

        // select random tile from adjacentTiles and swap with emptyTile
        const randomIndex = Math.floor(Math.random() * adjacentTiles.length);
        adjacentTiles[randomIndex].click();
    }

    gameStart = true;
}

const getTileContent = (height, width) => {
    const content = []
    for (let i = 1; i < height * width + 1; i++) {
        content.push(i);
    }

    if (toggleRandomMissingTile) {
        // assign random tile as missing
        const randomIndex = Math.floor(Math.random() * content.length)
        console.log("make random missing", randomIndex + 1);
        content[randomIndex] = ""
    } else {
        // bottom-left tile as missing
        content[content.length - 1] = "";
    }
    
    return content;
};

const createBoard = (width, height) => {
    // set frame dimensions and image
    const dimension = (width === height) ? "square" : `${width}x${height}`
    console.log(dimension);
    const frame = document.querySelector(".frame");
    frame.classList.add("frame-" + dimension);
    frame.style.backgroundImage = `url(images/frame_${dimension}.png)`

    const content = getTileContent(height, width);
    let contentIndex = 0;

    const gameGrid = Array.from(Array(height), () => new Array(width));

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.classList.add(`tile-width${width}`);
            newTile.id = `tile${i}${j}`;
            newTile.addEventListener('click', clickTile);
    
            const tileContent = document.createElement("p");
            tileContent.id = `img${contentIndex + 1}`;
            gameGrid[i][j] = contentIndex + 1;
            tileContent.innerText = (content[contentIndex]);
            contentIndex++;

            newTile.append(tileContent);
            document.querySelector(".grid").append(newTile);

            if (tileContent.innerText === "") {
                emptyTileID = newTile.id;
            }
        }
    }
    return gameGrid;
};

let gameStart = false; // to prevent checkWin during shuffle
let emptyTileID = "";
let toggleRandomMissingTile = false; // to toggle randomised missing tile

const gameGrid = createBoard(3, 3);
shuffleBoard();
