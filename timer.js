export const timer = {
    gameTime: 0,
    gameInterval: null,

    resetTimer: function() {
        clearInterval(this.gameInterval);
        this.gameTime = 0;
        const minutesLabel = document.querySelector("#timer-minutes");
        const secondsLabel = document.querySelector("#timer-seconds");
        secondsLabel.innerText = "00";
        minutesLabel.innerText = "00";
    },

    stopTimer: function(gameInterval) {
        clearInterval(this.gameInterval);
    },

    startTimer: function() {
        const minutesLabel = document.querySelector("#timer-minutes");
        const secondsLabel = document.querySelector("#timer-seconds");
        this.gameInterval = setInterval(() => {      
            this.gameTime++;
            secondsLabel.innerText = String((this.gameTime % 60)).padStart(2, '0');
            minutesLabel.innerText = String((Math.floor(this.gameTime / 60))).padStart(2, '0');
        }, 1000);
    }
}
