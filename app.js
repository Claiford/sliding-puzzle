const checkWin = () => {
    ///// this function loops through gameGrid tracker and check if img sequence are in ascending order /////
    let isWin = true;
    let prevNum = gameGrid[0][0];
    for (let row of gameGrid) {
        for (let thisNum of row) {
            if (thisNum < prevNum) {
                isWin = false;
                break;
            }
            prevNum = thisNum;
        }
    }
    return isWin;
}

const swapTileContent = (filledTile, emptyTile) => {
    ///// this function performs swap of image content of two tiles /////
    filledTile.append(emptyTile.querySelector("img"));
    emptyTile.append(filledTile.querySelector("img"));

    // update gameGrid tracker
    const temp = gameGrid[filledTile.id[4]][filledTile.id[5]];
    gameGrid[filledTile.id[4]][filledTile.id[5]] = gameGrid[emptyTile.id[4]][emptyTile.id[5]];
    gameGrid[emptyTile.id[4]][emptyTile.id[5]] = temp;

    // update empty tile tracker
    emptyTileID = filledTile.id;
    console.log(gameGrid);
};

const clickTile = (event) => {
    ///// this function checks if any adjacent tile is the empty tile, if so swap content /////
    const thisTile = event.currentTarget;
    const thisTileRow = Number(thisTile.id[4]);
    const thisTileCol = Number(thisTile.id[5]);
    
    // check adjacent tiles in clockwise order
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

    // check if winning condition is met
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

    const finalTileContent = document.querySelector(`#${emptyTileID} img`);
    finalTileContent.style.visibility = "visible";
}

const shuffleBoard = (moves) => {
    ///// this function randomises {moves} times from initial complete board /////
    for (let i = 0; i < moves; i++) {
        const emptyTileRow = Number(emptyTileID[4]);
        const emptyTileCol = Number(emptyTileID[5]);
        
        // check if adjacent tile exists and push to array
        const adjacentTiles = [];
        // top tile
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

    // trigger gameStart flag
    gameStart = true;
}

const fillTileContent = (gameGrid, imageURL) => {
    // create canvas to draw and crop image
    const canvas = document.createElement("canvas")
    const canvasWidth = 300;
    const canvasHeight = 300;
    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);
    const ctx = canvas.getContext("2d");

    // loop through tiles and add cropped image as tile content
    const allTiles = document.querySelectorAll(".tile");
    for (let tileIndex = 0; tileIndex < allTiles.length; tileIndex++) {
        const tile = allTiles[tileIndex];
        const tileContent = document.createElement("img");

        // pixel coordinates on source image to crop from based on tile position
        const xPos = Number(tile.id[5]) * 300;
        const yPos = Number(tile.id[4]) * 300;
        
        const fullImage = new Image();
        fullImage.src = imageURL;
        fullImage.onload = () => {
            ctx.drawImage(fullImage, xPos, yPos, 300, 300, 0, 0, canvasWidth, canvasHeight);
            const myImage = document.querySelector("#this-image");
            tileContent.src = canvas.toDataURL();
        };
        tile.append(tileContent);
        
        // set visibility of image to hidden for empty tile
        if (tile.id === emptyTileID) {
            tileContent.style.visibility = "hidden";
        }

        // initialise gameGrid with sequential order for checking of win state in game
        gameGrid[tile.id[4]][tile.id[5]] = tileIndex + 1;
    }
    canvas.remove();
}

const createBoard = (width, height) => {
    // set frame dimensions and frame image
    const dimension = (width === height) ? "square" : `${width}x${height}`
    const frame = document.querySelector("#game-frame");
    frame.classList.add("frame-" + dimension);
    frame.style.backgroundImage = `url(images/frame_${dimension}.png)`

    // set index for empty tile based on toggleRandomMissingTile
    const emptyIndex = toggleRandomMissingTile ? Math.floor(Math.random() * (width * height)) : (width * height) - 1;
    
    // create DOM tiles
    let trackingIndex = 0; // track index of tile placement to set empty tile
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.classList.add(`tile-width${width}`);
            newTile.id = `tile${i}${j}`;
            newTile.addEventListener('click', clickTile);
    
            document.querySelector("#game-grid").append(newTile);

            // set initial empty tile position
            if (trackingIndex === emptyIndex) {
                emptyTileID = newTile.id;
                console.log(emptyTileID);
            }
            trackingIndex++;
        }
    }

    const gameGrid = Array.from(Array(height), () => new Array(width));
    fillTileContent(gameGrid, "./images/gryffindor_crest.png");
    return gameGrid;
};

let emptyTileID = "";
let gameStart = false; // flag to prevent checkWin during shuffle
let toggleRandomMissingTile = false; // to toggle randomised missing tile

const gameGrid = createBoard(3, 3);
shuffleBoard(1);
