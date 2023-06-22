import { Board } from './board.js';
import { scorer } from './scorer.js';

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

    const playBtn = document.querySelector("#play-button");
    playBtn.addEventListener("click", board.startBoard)

    const pauseBtn = document.querySelector("#pause-button");
    pauseBtn.addEventListener("click", board.pauseBoard)

    const highscoreBtn = document.querySelector("#highscore-button");
    highscoreBtn.addEventListener("click", () => {
        scorer.updateHighscoreTable(board);
    });

    const highscoreForm = document.querySelector("#highscore-form");
    const highscoreFilters = highscoreForm.querySelectorAll("input[type='checkbox']");
    for (let filter of highscoreFilters) {
        filter.addEventListener("change", () => {
            scorer.updateHighscoreTable(board);
        });
    }

    const scoreForm = document.querySelector("#score-form");
    scoreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        scorer.submitScore(board);
    })
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