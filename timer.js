export {timer};

const timer = {
    gameInterval: null,

    resetTimer: function() {
        const minutesLabel = document.querySelector("#timer-minutes");
        const secondsLabel = document.querySelector("#timer-seconds");
        secondsLabel.innerText = "00";
        minutesLabel.innerText = "00";
    },

    stopTimer: function(gameInterval) {
        clearInterval(this.gameInterval);
    },

    startTimer: function(gameTime) {
        const minutesLabel = document.querySelector("#timer-minutes");
        const secondsLabel = document.querySelector("#timer-seconds");
        this.gameInterval = setInterval(() => {      
            gameTime++;
            secondsLabel.innerText = String((gameTime % 60)).padStart(2, '0');
            minutesLabel.innerText = String((Math.floor(gameTime / 60))).padStart(2, '0');
        }, 1000);
    }
}
