# **Revelio**

## A "Wizarding World" themed sliding puzzle game
<br>

> The [**Revelio Charm**](https://harrypotter.fandom.com/wiki/Revelio_Charm) is used to reveal concealed objects, messages, invisible things, and passages or any other secretly written messages and hidden markings.

<br>

# About

Sliding puzzles are a form of combination puzzles which requires the player to move puzzle pieces on a 2-dimensional plane to establish a certain final configuration. 

<img src="./images/readme_imgs/shuffled.png"  width="400" height="400">

Typically the final configuration is established with the bottom-right piece of the puzzle missing.

<img src="./images/readme_imgs/unshuffled.png"  width="400" height="400">

<br>

> Fun fact: These puzzles are also sometimes known as *'8-puzzles'* or *'15-puzzles'*, since they are usually a square grid [e.g. (3x3) or (4x4)] with the last tile missing.

<br>

# How to play

The game is played by clicking on tiles adjacent to the empty space 

<img src="./images/readme_imgs/clicktile.png"  width="380" height="380">
<img src="./images/readme_imgs/swaptile.png"  width="380" height="380">

<br>

# Difficulty levels

There are 3 difficulty levels to select from: WOMBAT, OWL and NEWT.
<table>
  <thead>
    <tr>
      <th scope="col">Difficulty</th>
      <th scope="col">Last tile puzzle</th>
      <th scope="col">Show tile sequence</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
          <p>🐨 W.O.M.B.A.T</p>
          Wizards' Ordinary Magic and Basic Aptitude Test
      </td>
      <td>✔️</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>
          <p>🦉 O.W.L.</p>
          Ordinary Wizarding Level
      </td>
      <td>❌</td>
      <td>✔️</td>
    </tr>
    <tr>
      <td>
          <p>🦎 N.E.W.T.</p>
          Nastily Exhausting Wizarding Test
      </td>
      <td>❌</td>
      <td>❌</td>
    </tr>
  </tbody>
</table>

## WOMBAT (easy)
✔️ Last tile puzzle: 
> missing tile is the bottom-right tile

✔️ Show tile sequence:
> tile sequence is provided in the top-left corner

<br>

## OWL (medium)
❌ Last tile puzzle: 
> missing tile is randomised

✔️ Show tile sequence:
> tile sequence is provided in the top-left corner

<br>

## NEWT (hard)
❌ Last tile puzzle: 
> missing tile is randomised

❌ Show tile sequence:
> tile sequence is not provided

<br>

# Project goals
<hr>

Task | Completion | Date | Remarks
------------ | ------------- | ------------- | -------------
3x3 grid | [x] | 10-Jun | -
swappable tiles | [x] | 10-Jun | tilecontent is swapped
variable grid size | [x] | 10-Jun | -
shuffle grid | [x] | 10-Jun | shuffle from initial complete board
randomise missing tile | [x] | 10-Jun | toggle on/off
grid completion | [x] | 10-Jun | -
variable frame size | [x] | 12-Jun | -
tile with images | [x] | 13-Jun | using canvas to crop original image
game screen layout | [x] | 14-Jun | -
toggle image sequence | [x] | 14-Jun | -
difficulty info and selection | [x] | 15-Jun | bootstrap modals
move no. tracking | [x] | 15-Jun | -
time tracking | [x] | 15-Jun | timer.js
highscores retrieval | [x] | 17-Jun | bootstrap offcanvas, supabase: fetch data
play/pause/reset | [x] | 21-Jun | -
highscore submissions | [x] | 22-Jun | supabase: insert data, scorer.js
responsive layout | [x] | 22-Jun | -
favicon | [x] | 22-Jun | tab icon
puzzle loader | [x] | 22-Jun | setTimeout
selection screen layout | [ ] | -
grid size selection | [ ] | -
image selection | [ ] | -