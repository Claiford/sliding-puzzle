const getTileContent = (height, width) => {
    tileTotal = height * width;
    content = []
    for (let i = 1; i < tileTotal + 1; i++) {
        content.push(i);
    }
    content[tileTotal - 1] = "X"
    return content;
}

const createBoard = (height, width) => {
    const grid = Array.from(Array(height), () => new Array(width));

    const content = getTileContent(height, width);
    let itemIndex = 0;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const newTile = document.createElement("div");
            newTile.classList.add("tile");
            newTile.id = `${i}${j}`;
    
            const tileContent = document.createElement("p");
            tileContent.innerText = content[itemIndex];
            itemIndex++;
    
            newTile.append(tileContent);
    
            document.querySelector(".grid").append(newTile);

            grid[i][j] = tileContent.innerText;
        }
    }
    return grid;
}

const grid = createBoard(3,3)
console.log(grid);


// const allTiles = document.querySelector(".tile");
// for (let tile of allTiles) {
//     tile.addEventListener('click', moveTile);
// }