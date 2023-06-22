import { timer } from "./timer.js";

export class Board {
    constructor(puzzle, dimension, difficulty) {
        this.gamePuzzle = puzzle;               // {string} name eg. "Gryffindor Crest"
        this.gameDimension = dimension;         // {string} dimension (width)x(height) eg. "3x3"
        this.gameDifficulty = difficulty;       // {string} difficulty eg. "wombat"
        this.gameGrid = null;                   // {arr[]}  eg. "Gryffindor Crest"
        this.gameMoveCount = 0;                 // {int}    number of tile clicks made
        this.toggleFixedMissingTile = true;     // {bool}   
        this.toggleShowImageSequence = true;    // {bool}   
        this.gameStart = false;                 // {bool}   
        this.emptyTileID = "";                  // {string}

    };

    constructBoard = () => {
        // update game info
        document.querySelector("#info-puzzle").innerText = this.gamePuzzle;
        document.querySelector("#info-dimension").innerText = this.gameDimension;
        this.setDifficulty(this.gameDifficulty);

        // set frame dimensions and frame image
        const width = Number(this.gameDimension[0]);
        const height = Number(this.gameDimension[2]);
        const dimension = (width === height) ? "square" : this.gameDimension
        const frame = document.querySelector("#game-frame");
        frame.classList.add("frame-" + dimension);
        frame.style.backgroundImage = `url(images/frame_${dimension}.png)`
    
        // set index for empty tile based on difficulty toggle: toggleRandomMissingTile
        const emptyIndex = this.toggleFixedMissingTile ? (width * height) - 1: Math.floor(Math.random() * (width * height));
        
        // create DOM tiles
        let trackingIndex = 0; // track index of tile placement to set empty tile
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const newTile = document.createElement("div");
                newTile.classList.add("tile");
                newTile.classList.add(`tile-width${width}`);
                newTile.id = `tile${i}${j}`;
                newTile.addEventListener('click', this.clickTile);
        
                document.querySelector("#game-grid").append(newTile);
    
                // set initial empty tile position
                if (trackingIndex === emptyIndex) {
                    this.emptyTileID = newTile.id;
                }
                trackingIndex++;
            }
        }
        
        // initialise internal content array
        this.gameGrid = Array.from(Array(height), () => new Array(width));

        this.fillTileContent();
        this.shuffleBoard(100);

        // show game mask
        document.querySelector("#game-mask").style.visibility = "visible";
    };

    resetBoard = () => {
        // show pause button
        document.querySelector("#pause-button").style.visibility = "visible";
        // hide complete alert message
        document.querySelector("#complete-alert").style.visibility = "hidden";

        // revert score-form elements
        document.querySelector("#score-form").reset();
        document.querySelector("#score-form").style.display = "block";
        document.querySelector("#score-form-post").style.display = "none";

        // remove existing frame contents
        const frame = document.querySelector("#game-frame")
        frame.classList.remove(frame.classList[3]);
        document.querySelector("#game-grid").innerHTML = "";
        
        // reset board variables
        this.emptyTileID = null;
        this.gameStart = false
        this.gameMoveCount = 0;
        document.querySelector("#info-movecount").innerText = this.gameMoveCount;

        // reset timer
        timer.resetTimer();

        this.constructBoard();
    };
    
    setDifficulty = (selectedDifficulty) => {
        //// this function adjusts game settings based on selected difficulty /////
        // adjust toggles
        if (selectedDifficulty === "wombat") {
            this.toggleFixedMissingTile = true;
            this.toggleShowImageSequence = true;
        } else if (selectedDifficulty === "owl") {
            this.toggleFixedMissingTile = false;
            this.toggleShowImageSequence = true;
        } else if (selectedDifficulty === "newt") {
            this.toggleFixedMissingTile = false;
            this.toggleShowImageSequence = false;
        }
    
        // update difficulty buttons checked status
        const difficultyBtns = document.querySelectorAll("#difficulty-form input[type='radio']");
        for (let btn of difficultyBtns) {
            (btn.id === selectedDifficulty) ? btn.setAttribute("checked", "checked") : btn.removeAttribute("checked");
        }
    };
    
    fillTileContent = () => {
        // create canvas element to draw and crop image
        const canvas = document.createElement("canvas")
        const canvasWidth = 300;
        const canvasHeight = 300;
        canvas.setAttribute("width", canvasWidth);
        canvas.setAttribute("height", canvasHeight);
        const ctx = canvas.getContext("2d");

        // set image path
        const imageName = this.gamePuzzle.toLowerCase().replace(" ", "_");
        const imageURL = `./images/${imageName}.png`

        // loop through tiles to add individual tile content
        const allTiles = document.querySelectorAll(".tile");
        for (let tileIndex = 0; tileIndex < allTiles.length; tileIndex++) {
            const tile = allTiles[tileIndex];
    
            // parent container for image and number
            const tileContent = document.createElement("div");
            tileContent.classList.add("tile-content");
            
            // img element containing cropped portion of source image
            const contentImage = document.createElement("img");
            //// pixel coordinates on source image to crop based on tile position (multiples of 300px)
            const xPos = Number(tile.id[5]) * 300;
            const yPos = Number(tile.id[4]) * 300;
            const fullImage = new Image();
            fullImage.src = imageURL;
            fullImage.onload = () => {
                ctx.drawImage(fullImage, xPos, yPos, 300, 300, 0, 0, canvasWidth, canvasHeight);
                const myImage = document.querySelector("#this-image");
                contentImage.src = canvas.toDataURL();
            };
            tileContent.append(contentImage);
    
            // span element containing image sequence number
            const contentNum = document.createElement("span");
            contentNum.classList.add("img-number");
            contentNum.classList.add("badge", "bg-dark");
            contentNum.innerText = tileIndex + 1;
            tileContent.append(contentNum);
    
            // set visibility of img sequence based on difficulty toggle: toggleShowImageSequence
            if (this.toggleShowImageSequence) {
                contentNum.style.visibility = "visible";
            }
            
            // set visibility of image to hidden for empty tile
            if (tile.id === this.emptyTileID) {
                contentImage.style.visibility = "hidden";
            }
    
            // initialise gameGrid with sequential order for checking of win state in game
            this.gameGrid[tile.id[4]][tile.id[5]] = tileIndex + 1;
    
            tile.append(tileContent);
        }
        // remove canvas element
        canvas.remove();
    };

    shuffleBoard = (moves) => {
        ///// this function randomises {moves} times from initial complete board /////
        for (let i = 0; i < moves; i++) {
            const emptyTileRow = Number(this.emptyTileID[4]);
            const emptyTileCol = Number(this.emptyTileID[5]);
            
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
    };

    startBoard = () => {
        // hide game mask
        document.querySelector("#game-mask").style.visibility = "hidden";

        // start game timer
        timer.startTimer();
        
        // trigger gameStart flag
        this.gameStart = true;
    };

    pauseBoard = () => {
        // show game mask
        document.querySelector("#game-mask").style.visibility = "visible";

        // stop game timer
        timer.stopTimer();
    };

    endBoard = () => {
        this.gameStart = false;

        // remove tile click event handler
        const allTiles = document.querySelectorAll(".tile");
        for (let tile of allTiles) {
            tile.removeEventListener('click', this.clickTile);
        }
        
        // show final tile image
        const finalTileContent = document.querySelector(`#${this.emptyTileID} img`);
        finalTileContent.style.visibility = "visible";
        
        // stop game timer
        timer.stopTimer();

        // hide pause button
        document.querySelector("#pause-button").style.visibility = "hidden";

        // show complete alert message
        document.querySelector("#complete-alert").style.visibility = "visible";
    };

    clickTile = (event) => {
        ///// this function checks if any adjacent tile is the empty tile, if so swap content /////
        const thisTile = event.currentTarget;
        const thisTileRow = Number(thisTile.id[4]);
        const thisTileCol = Number(thisTile.id[5]);
        
        // check adjacent tiles in clockwise order
        // top tile
        const topTile = document.querySelector(`#tile${thisTileRow - 1}${thisTileCol}`);
        if ((topTile) && topTile.id === this.emptyTileID) this.swapTileContent(thisTile, topTile);
        // right tile
        const rightTile = document.querySelector(`#tile${thisTileRow}${thisTileCol + 1}`);
        if ((rightTile) && rightTile.id === this.emptyTileID) this.swapTileContent(thisTile, rightTile);
        // bottom tile
        const bottomTile = document.querySelector(`#tile${thisTileRow + 1}${thisTileCol}`);
        if ((bottomTile) && bottomTile.id === this.emptyTileID) this.swapTileContent(thisTile, bottomTile);
        // left tile
        const leftTile = document.querySelector(`#tile${thisTileRow}${thisTileCol - 1}`);
        if ((leftTile) && leftTile.id === this.emptyTileID) this.swapTileContent(thisTile, leftTile)
    
        // check if winning condition is met
        if (this.gameStart && this.checkWin()) {
            this.endBoard();
        }
    };

    swapTileContent = (filledTile, emptyTile) => {
        ///// this function performs swap of image content of two tiles /////
        filledTile.append(emptyTile.querySelector(".tile-content"));
        emptyTile.append(filledTile.querySelector(".tile-content"));
    
        // update gameGrid tracker
        const temp = this.gameGrid[filledTile.id[4]][filledTile.id[5]];
        this.gameGrid[filledTile.id[4]][filledTile.id[5]] = this.gameGrid[emptyTile.id[4]][emptyTile.id[5]];
        this.gameGrid[emptyTile.id[4]][emptyTile.id[5]] = temp;
    
        // update empty tile tracker
        this.emptyTileID = filledTile.id;
    
        // update moves if game has started
        if (this.gameStart) {
            this.gameMoveCount++;
            document.querySelector("#info-movecount").innerText = this.gameMoveCount;
        };
    };

    checkWin = () => {
        ///// this function loops through gameGrid tracker and check if img sequence is in ascending order /////
        let isWin = true;
        let prevNum = this.gameGrid[0][0];
        for (let row of this.gameGrid) {
            for (let thisNum of row) {
                if (thisNum < prevNum) {
                    isWin = false;
                    break;
                }
                prevNum = thisNum;
            }
        }
        return isWin;
    };
}