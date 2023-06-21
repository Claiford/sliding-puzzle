import { Board } from './board.js';

const updateHighscoreTable = async () => {
    const highscoreTable = document.querySelector("#highscore-table");
    highscoreTable.innerHTML = "";

    const formFilters = new FormData(document.querySelector("#highscore-form")).getAll("filters");

    let query = supabase
        .from('highscores')
        .select()
    if (formFilters.includes("puzzle"))  { query = query.eq('puzzle', board.gamePuzzle) }
    if (formFilters.includes("dimension"))  { query = query.eq('grid_size', board.gameDimension) }
    if (formFilters.includes("difficulty"))  { query = query.eq('difficulty', board.gameDifficulty) }
    query = query
        .order('time_seconds', { ascending: true })
        .limit(10)

    const {data, error} = await query

    for (let row of data) {
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

const confirmChangeDifficulty = (e) => {
    e.preventDefault();
    board.gameDifficulty = (new FormData(e.target)).get("difficulty-options");
    board.resetBoard();
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

const board = new Board("Gryffindor Crest", "3x3", "wombat");
board.constructBoard();