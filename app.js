const checkWin = () => {
    ///// this function loops through gameGrid tracker and check if img sequence is in ascending order /////
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

const move = () => {
    moveCount++;
    document.querySelector("#info-movecount").innerText = moveCount;
}

const swapTileContent = (filledTile, emptyTile) => {
    ///// this function performs swap of image content of two tiles /////
    filledTile.append(emptyTile.querySelector(".tile-content"));
    emptyTile.append(filledTile.querySelector(".tile-content"));

    // update gameGrid tracker
    const temp = gameGrid[filledTile.id[4]][filledTile.id[5]];
    gameGrid[filledTile.id[4]][filledTile.id[5]] = gameGrid[emptyTile.id[4]][emptyTile.id[5]];
    gameGrid[emptyTile.id[4]][emptyTile.id[5]] = temp;

    // update empty tile tracker
    emptyTileID = filledTile.id;

    // update moves
    if (gameStart) move();
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

    endTimer();
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

    // loop through tiles to add tile content
    const allTiles = document.querySelectorAll(".tile");
    for (let tileIndex = 0; tileIndex < allTiles.length; tileIndex++) {
        const tile = allTiles[tileIndex];

        // parent container for image and number
        const tileContent = document.createElement("div");
        tileContent.classList.add("tile-content");
        
        // img element containing cropped portion of source image
        const contentImage = document.createElement("img");
        //// pixel coordinates on source image to crop from based on tile position
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

        // span element containing img sequence number
        const contentNum = document.createElement("span");
        contentNum.classList.add("img-number");
        contentNum.classList.add("badge", "bg-dark");
        contentNum.innerText = tileIndex + 1;
        tileContent.append(contentNum);

        // set visibility of img sequence
        if (toggleShowImageSequence) {
            contentNum.style.visibility = "visible";
        }
        
        // set visibility of image to hidden for empty tile
        if (tile.id === emptyTileID) {
            contentImage.style.visibility = "hidden";
        }

        // initialise gameGrid with sequential order for checking of win state in game
        gameGrid[tile.id[4]][tile.id[5]] = tileIndex + 1;

        tile.append(tileContent);
    }
    canvas.remove();
}

const createBoard = (puzzle, width, height) => {
    // set frame dimensions and frame image
    const dimension = (width === height) ? "square" : `${width}x${height}`
    const frame = document.querySelector("#game-frame");
    frame.classList.add("frame-" + dimension);
    frame.style.backgroundImage = `url(images/frame_${dimension}.png)`

    // set index for empty tile based on toggleRandomMissingTile
    const emptyIndex = toggleFixedMissingTile ? (width * height) - 1: Math.floor(Math.random() * (width * height));
    
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
            }
            trackingIndex++;
        }
    }

    gameGrid = Array.from(Array(height), () => new Array(width));
    imageName = puzzle.toLowerCase().replace(" ", "_");
    fillTileContent(gameGrid, `./images/${imageName}.png`);
};

const resetBoard = (puzzle, dimension) => {
    const frame = document.querySelector("#game-frame")
    frame.classList.remove(frame.classList[3]);
    document.querySelector("#game-grid").innerHTML = "";

    emptyTileID = ""
    gameStart = false
    createBoard(puzzle, Number(dimension[0]), Number(dimension[2]));
    shuffleBoard(100);
    endTimer();
    startTimer();
};

const confirmChangeDifficulty = (e) => {
    e.preventDefault();
    setDifficulty((new FormData(e.target)).get("difficulty-options"));
    resetBoard(gamePuzzle, gameDimension)
};

const alertChangeDifficulty = (e) => {
    document.querySelector("#change-modal-selection").innerText = e.target.id.toUpperCase();

    const changeModalBody = document.querySelector("#change-modal-body");
    changeModalBody.innerHTML = "";
    const clone = document.querySelector(`#difficulty-desc-${e.target.id}`).cloneNode(true);
    changeModalBody.append(clone);

    const changeModal = new bootstrap.Modal('#change-modal');
    changeModal.show();
};

const setDifficulty = (selectedDifficulty) => {
    //// this function adjusts game settings based on selected difficulty /////
    // adjust toggles
    if (selectedDifficulty === "wombat") {
        toggleFixedMissingTile = true;
        toggleShowImageSequence = true;
    } else if (selectedDifficulty === "owl") {
        toggleFixedMissingTile = false;
        toggleShowImageSequence = true;
    } else if (selectedDifficulty === "newt") {
        toggleFixedMissingTile = false;
        toggleShowImageSequence = false;
    }

    // update difficulty buttons checked status
    const difficultyBtns = document.querySelectorAll("#difficulty-form input[type='radio']");
    for (let btn of difficultyBtns) {
        (btn.id === selectedDifficulty) ? btn.setAttribute("checked", "checked") : btn.removeAttribute("checked");
    }
};

updateHighscoreTable = async () => {
    const highscoreTable = document.querySelector("#highscore-table");
    highscoreTable.innerHTML = "";

    let filterByPuzzle = null;
    let filterByDimension = null;
    let filterByDifficulty = null;

    formFilters = new FormData(document.querySelector("#highscore-form")).getAll("filters");
    for (let filter of formFilters) {
        filterByPuzzle = (filter === "puzzle") ? gamePuzzle : null;
        filterByDimension = (filter === "dimension") ? gameDimension : null;
        filterByDifficulty = (filter === "difficulty") ? gameDifficulty : null;
    }

    let query = supabase
        .from('highscores')
        .select()

    if (filterByPuzzle)  { query = query.eq('puzzle', filterByPuzzle) }
    if (filterByDimension)  { query = query.eq('grid_size', filterByDimension) }
    if (filterByDifficulty)  { query = query.eq('difficulty', filterByDifficulty) }

    const {data, error} = await query

    for (let row of data) {
        console.log(row);
        const newRow = document.createElement("tr");
        // user
        const player = document.createElement("td");
        player.innerText = row["player_name"];
        newRow.append(player);
        // puzzle
        const puzzle = document.createElement("td");
        puzzle.innerText = row["puzzle"];
        newRow.append(puzzle);
        // dimension
        const dimension = document.createElement("td");
        dimension.innerText = row["grid_size"];
        newRow.append(dimension);
        // difficulty
        const difficulty = document.createElement("td");
        difficulty.innerText = row["difficulty"];
        newRow.append(difficulty);
        // time
        const time = document.createElement("td");
        const minutes = String(Math.floor(row["time_seconds"] / 60)).padStart(2, '0')
        const seconds = String((row["time_seconds"] % 60)).padStart(2, '0');
        time.innerText = `${minutes}:${seconds}`;
        newRow.append(time);
        // moves
        const moves = document.createElement("td");
        moves.innerText = row["move_count"];
        newRow.append(moves);

        highscoreTable.append(newRow);
    }
};

const resetTimer = () => {
    const minutesLabel = document.querySelector("#timer-minutes");
    const secondsLabel = document.querySelector("#timer-seconds");
    secondsLabel.innerText = "00";
    minutesLabel.innerText = "00";
}

const endTimer = () => {
    clearInterval(gameInterval);
}

const startTimer = () => {
    const minutesLabel = document.querySelector("#timer-minutes");
    const secondsLabel = document.querySelector("#timer-seconds");
    // elapsedSeconds = 0;
    gameInterval = setInterval(() => {
        // elapsedSeconds++;
        // secondsLabel.innerText = String((elapsedSeconds % 60)).padStart(2, '0');
        // minutesLabel.innerText = String((Math.floor(elapsedSeconds / 60))).padStart(2, '0');
        
        globalSeconds++;
        secondsLabel.innerText = String((globalSeconds % 60)).padStart(2, '0');
        minutesLabel.innerText = String((Math.floor(globalSeconds / 60))).padStart(2, '0');
    }, 1000);
}

const newGame = (puzzle, dimension, difficulty) => {
    gamePuzzle = puzzle;
    gameDimension = dimension;
    gameDifficulty = difficulty;

    setDifficulty(gameDifficulty);
    resetBoard(gamePuzzle, gameDimension);
}

//////////
//    ___ __ __    ___  ____   ______      __ __   ____  ____   ___    _        ___  ____    _____
//   /  _]  |  |  /  _]|    \ |      |    |  |  | /    ||    \ |   \  | |      /  _]|    \  / ___/
//  /  [_|  |  | /  [_ |  _  ||      |    |  |  ||  o  ||  _  ||    \ | |     /  [_ |  D  )(   \_ 
// |    _]  |  ||    _]|  |  ||_|  |_|    |  _  ||     ||  |  ||  D  || |___ |    _]|    /  \__  |
// |   [_|  :  ||   [_ |  |  |  |  |      |  |  ||  _  ||  |  ||     ||     ||   [_ |    \  /  \ |
// |     |\   / |     ||  |  |  |  |      |  |  ||  |  ||  |  ||     ||     ||     ||  .  \ \    |
// |_____| \_/  |_____||__|__|  |__|      |__|__||__|__||__|__||_____||_____||_____||__|\_|  \___|
//
//////////

document.addEventListener("DOMContentLoaded", () => {
    const difficultyForm = document.querySelector("#difficulty-form");
    difficultyForm.addEventListener('submit', confirmChangeDifficulty);

    const difficultyBtns = difficultyForm.querySelectorAll("input[type='radio']");
    for (let btn of difficultyBtns) {
        btn.addEventListener("change", alertChangeDifficulty);
    };

    const supabaseUrl = 'https://dklnskoijtaxitqqfmmy.supabase.co'
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbG5za29panRheGl0cXFmbW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY5NjI1NDQsImV4cCI6MjAwMjUzODU0NH0.nefGe9Xe7fJbBVpTscf0ma9oOlJhKUDqSnZNy5bCbv8"
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

    const highscoreBtn = document.querySelector("#highscore-btn");
    highscoreBtn.addEventListener("click", () => updateHighscoreTable());

    const highscoreForm = document.querySelector("#highscore-form");
    // highscoreForm.addEventListener('submit', updateHighscoreTable)

    const highscoreFilters = highscoreForm.querySelectorAll("input[type='checkbox']");
    for (let filter of highscoreFilters) {
        filter.addEventListener("change", updateHighscoreTable);
    }
});

//////////
//  ____  ____   ____  ______  ____   ____  _      ____ _____   ___ 
// |    ||    \ |    ||      ||    | /    || |    |    / ___/  /  _]
//  |  | |  _  | |  | |      | |  | |  o  || |     |  (   \_  /  [_ 
//  |  | |  |  | |  | |_|  |_| |  | |     || |___  |  |\__  ||    _]
//  |  | |  |  | |  |   |  |   |  | |  _  ||     | |  |/  \ ||   [_ 
//  |  | |  |  | |  |   |  |   |  | |  |  ||     | |  |\    ||     |
// |____||__|__||____|  |__|  |____||__|__||_____||____|\___||_____|
//
//////////

let emptyTileID = "";
let gameStart = false; // flag to prevent checkWin during shuffle
let toggleFixedMissingTile = true; // to toggle randomised missing tile
let toggleShowImageSequence = true; // to toggle image sequence visibility
let moveCount = 0; // moves tracker
let gameInterval = null; // timer
let globalSeconds = 0; // timer tracker
let gameGrid = null;
let gamePuzzle = null;
let gameDimension = null;
let gameDifficulty = null;

let supabase = "";

newGame("Gryffindor Crest", "3x3", "wombat")
