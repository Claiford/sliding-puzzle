import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { timer } from './timer.js';

const SUPABASE_URL = 'https://dklnskoijtaxitqqfmmy.supabase.co';
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbG5za29panRheGl0cXFmbW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY5NjI1NDQsImV4cCI6MjAwMjUzODU0NH0.nefGe9Xe7fJbBVpTscf0ma9oOlJhKUDqSnZNy5bCbv8";
const SUPABASE = createClient(SUPABASE_URL, SUPABASE_KEY);

export const scorer = {
    updateHighscoreTable: async function(board) {
        const highscoreTable = document.querySelector("#highscore-table");
        highscoreTable.innerHTML = "";
    
        const formFilters = new FormData(document.querySelector("#highscore-form")).getAll("filters");
    
        let query = SUPABASE
            .from('highscores')
            .select();
        if (formFilters.includes("puzzle"))  { query = query.eq('puzzle', board.gamePuzzle) }
        if (formFilters.includes("dimension"))  { query = query.eq('grid_size', board.gameDimension) }
        if (formFilters.includes("difficulty"))  { query = query.eq('difficulty', board.gameDifficulty) }
        query = query
            .order('time_seconds', { ascending: true })
            .limit(10);
    
        const {data, error} = await query;
    
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
    },

    submitScore: async function(board) {
        const { error } = await SUPABASE
            .from('highscores')
            .insert({ 
                player_name: document.querySelector("#score-form input").value, 
                puzzle: board.gamePuzzle,
                grid_size: board.gameDimension,
                difficulty: board.gameDifficulty,
                time_seconds: timer.gameTime,
                move_count: board.gameMoveCount
            });

        document.querySelector("#score-form").style.display = "none";
        document.querySelector("#score-form-post").style.display = "block";
    }
}