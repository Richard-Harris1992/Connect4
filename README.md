## Connect 4

This was a project idea to make a favorite childhood game. 

![Connect 4 board](./images/connect4.png)

[-Live site](https://richard-harris1992.github.io/Connect4/)

## Build Status

Project is a static HTML/CSS/JS web site and is hosted directly from the GitHub respository via GitHub Pages

## Technologies and languages used

- HTML
- CSS
- Javascript

## Installation Instructions

1. Clone the repository 
    -Run the following in your terminal: `git clone https://github.com/Richard-Harris1992/Connect4.git`

2. Run index.html file from browser or Live-Server.

3. Enjoy!

## Game mechanics:

1. Two players (User vs PC)

2. Gameplay
![End state](./images/gameplay.png)
    - Starting with the user, they will drop their first coin.
    - The computer will then play.
    - There are 3 End states:
        - Win State
        - Lose State
        - Draw State
    - Once one of the above conditions is met, the user will have the option of starting a new game or to just take a look at the end state of the board.

## Functionality
The player clicks any area they would like to drop a coin.
    - The logic will determine the next valid slot within the column which was chosen and will drop a coin in that valid slot.
    - The computer problem has 3 "choice" that it can make.
        1. It will see if on its current turn, if it can win.
            - It does this by storing a cloned copy of the current game state, it then chooses each individual slot that is valid to choose and then checks if there is a winner.
            -If its a win, it will return the coordinates then place a coin in that location.
        2. If the above condition is false, it will do the inverse of the first and check for a loss.
        3. if both conditions are false, it will randomly select a valid slot and place its coin there.

## Future developments

    I would like to one day implement a minimax algorithm with alpha-beta pruning.
