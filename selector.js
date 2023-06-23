import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://dklnskoijtaxitqqfmmy.supabase.co';
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbG5za29panRheGl0cXFmbW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY5NjI1NDQsImV4cCI6MjAwMjUzODU0NH0.nefGe9Xe7fJbBVpTscf0ma9oOlJhKUDqSnZNy5bCbv8";
const SUPABASE = createClient(SUPABASE_URL, SUPABASE_KEY);

const loadPuzzles = async (dimension) => {
    document.querySelector("#title").style.display = "none";
    
    // show loader
    document.querySelector("#loader").classList.remove("d-none");
    document.querySelector(".center-backdrop").classList.add("d-none");

    const indicators = document.querySelector(".carousel-indicators");
    const content = document.querySelector(".carousel-inner");

    let query = SUPABASE
        .from('puzzles')
        .select()
        .eq('dimension', dimension)

    const {data, error} = await query;

    console.log(data);

    let trackingIndex = 0;
    for (let row of data) {
        if (trackingIndex === 0) {
            indicators.innerHTML += `<button type="button" data-bs-target="#puzzle-carousel" data-bs-slide-to="${trackingIndex}" class="active bg-secondary" aria-current="true" aria-label="Slide 1"></button>`

            content.innerHTML += `<div class="carousel-item active"><img src=${row['filepath']} class="d-block w-50 mx-auto img-thumbnail" alt="..."></div>`
        } else {
            indicators.innerHTML += `<button type="button" data-bs-target="#puzzle-carousel" data-bs-slide-to="${trackingIndex}" class="bg-secondary" aria-current="true" aria-label="Slide 1"></button>`

            content.innerHTML += `<div class="carousel-item"><img src=${row['filepath']} class="d-block w-50 mx-auto img-thumbnail" alt="..."></div>`
        }
        trackingIndex++;
    }

    // replace loader
    setTimeout(() => {
        document.querySelector("#loader").classList.add("d-none");
        document.querySelector(".center-backdrop").classList.remove("d-none");
    }, 1000);
};

const resetSelection = () => {
    document.querySelector(".carousel-indicators").innerHTML = "";
    document.querySelector(".carousel-inner").innerHTML = "";
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

document.addEventListener("DOMContentLoaded", () => {
    const selectBtn = document.querySelector("#select-button");
    selectBtn.addEventListener('click', () => {
        const check = document.querySelector(".carousel-inner .active");
        console.log(check)
    })

    const dimensionBtns = document.querySelectorAll(".menu-item");
    for (let btn of dimensionBtns) {
        btn.addEventListener('click', (e) => {
            console.log('click');
            const dimension = e.target.innerText;
            resetSelection();
            loadPuzzles(dimension);
        })
    }
});
