

//maybe see how I can break these methods into smaller methods.
//space for minimax

/*after each turn update currentGameStateMethod 'Red', 'Yellow' or 'Coin' <--representing an empty slot

const currentEmptyCells = (CurrentGameStateMethod()) => currentGameStateMethod().filter(slots => slots == 'Coin')

I think just returning the gameOver prop will satisfy the checking if there is a winner. step 5


I need a function that will run through empty slots and see if they pick one value then they will win.

I think for to pass the either current state or available state it would look like

atttack function player - Idk how to do here becuase the event listeners are contained in the elements.
I could do a click, e.target if this is contained in the array turn red.

maybe check the class here and then pass the value to the main array and update it.

maybe .bind() alt to use a function within the connectfour class

end goal is flexibility of methods needed to propery use minimax.

validMove(htmlNode = null) {
    //This is for when the player clicks an element.
    if(htmlNode != null) {
         if (this.gameOver) {
                    return;
                }


                let coords = htmlNode.id.split('-'); //'0-0' -> [0,0]

                let row = parseInt(coords[0]);
                let col = parseInt(coords[1]);

                row = this.availableMoves[col]; //pick the number at the index of col
                if (row < 0) { //should call win-game method and call it a draw.
                    return;
                }
                return this.gameBoard[row][col];
    } //player if.
} else

    valid moves to choose from
    validMovesComputer = []
    for(let columnIndex = 0; columnIndex < this.currentColumns.length; columnIndex++) {
        validMovesComputer.push(this.gameBoard[columnIndex,this.currentColumns[columnIndex]]) this pushes a coordinate of each available move to check.
    }







*/



class Player {
    constructor() {
        this.name = 'Player';
        this.color = 'Red';
    }
    attack(slots, availableMoves) {
        //slots is gameBoard, available news is currentSlots.
        let divOFslot = divs

    }
}
class Computer extends Player {
    constructor() {
        super();
        this.name = 'Computer';
        this.color = 'Yellow';
    }
}

class Coin {
    constructor(id, htmlElement) {
        this.id = id;
        this.htmlElement = htmlElement;

    }
}

class ConnectFour {
    constructor() {
        this.player1 = new Player();
        this.player2 = new Computer();
        this.currentPlayer = this.player1;
        this.rows = 6; // y-axis
        this.columns = 7; //x axis
        this.availableMoves = [5, 5, 5, 5, 5, 5, 5]; //this array keeps the coins from floating, they will fall into the bottom most row.
        this.gameOver = false;
        this.gameBoard = []
        this.gameBoardBuilder = this.setGame();
    }
    setGame() {

        for (let row = 0; row < this.rows; row++) {
            let rows = [];
            for (let col = 0; col < this.columns; col++) {


                //HTML

                let coin = document.createElement('div');
                coin.id = `${row}-${col}`;
                coin.classList.add('coin');
                let tileObj = new Coin(coin.id, coin);


                document.getElementById('board').appendChild(coin);
                rows.push(tileObj);
            }
            this.gameBoard.push(rows);
        }

        //after creating all coin slots, this loops through the gameboard array and attaches event listeners to the slots.
        this.addColorChangeClickEvent();

    }
    //test area for minimaxx fxn
    minimax() {
        let currentGameState = this.currentGameState();
        let computerMarker = this.player2.color;
        console.log(currentGameState);
        console.log(computerMarker);
        let currentEmptyCells = currentGameState.filter(slots => typeof slots == 'object');
        console.log(currentEmptyCells);
    }

    addColorChangeClickEvent() { ///THIS MIGHT BE MY MAIN FXN inside click event. like the click event will trigger minimax and check fxn

        let flattenedGameboardArray = this.gameBoard.flat()
        flattenedGameboardArray.forEach(coin => {

            let htmlNode = document.getElementById(coin.id);
            htmlNode.addEventListener('click', (e) => {
                if (this.gameOver) {
                    return;
                }


                
                let playerMove = this.validMove(htmlNode);
                //\ gets accepted move.  \/ alters page
            
                                
                if (this.currentPlayer == this.player1) {
                    playerMove.htmlElement.classList.add(this.player1.color);
                    this.currentPlayer = this.player2;
    
                } else {
                    playerMove.htmlElement.classList.add(this.player2.color);
                    this.currentPlayer = this.player1;
                    
                }

                //this.minimax(this.currentGameState, this.player2.color) // clean up all minimax stuff NOW!
                console.log(this.currentGameState())
                this.checkWinner();
            }); //end eventListener function
        });

    }

    validMove(htmlNode = null) {
        
        if (htmlNode != null) {
            let coords = htmlNode.id.split('-'); //'0-0' -> [0,0]

            let row = parseInt(coords[0]);
            let col = parseInt(coords[1]);

            row = this.availableMoves[col]; //pick the number at the index of col
            if (row < 0) { //should call win-game method and call it a draw.
                return;
            }
            
            let slotIndex = this.gameBoard[row][col]
            this.currentPlayer == this.player1 ? this.gameBoard[row][col] = 'Red' : this.gameBoard[row][col] = 'Yellow';
            
            row--; //updating row height for the column
            this.availableMoves[col] = row; //update array
            
            return slotIndex;
        } //player if.
    }
    currentGameState() {
        return this.gameBoard.flat();
    }

    checkWinner() {
        //sliding window technique
        //horizontally
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r][c + 1] && this.gameBoard[r][c + 1] == this.gameBoard[r][c + 2] && this.gameBoard[r][c + 2] == this.gameBoard[r][c + 3]) {
                        this.setWinner(r, c);
                        return;
                    }
                }
            }
        }
        // Vertical
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns; c++) {
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r + 1][c] && this.gameBoard[r + 1][c] == this.gameBoard[r + 2][c] && this.gameBoard[r + 2][c] == this.gameBoard[r + 3][c]) {
                        this.setWinner(r, c);
                        return;
                    }
                }
            }
        }

        //Horizontally-Left
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r + 1][c + 1] && this.gameBoard[r + 1][c + 1] == this.gameBoard[r + 2][c + 2] && this.gameBoard[r + 2][c + 2] == this.gameBoard[r + 3][c + 3]) {
                        this.setWinner(r, c);
                        return;
                    }
                }
            }
        }

        //Horizontally-Right
        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r - 1][c + 1] && this.gameBoard[r - 1][c + 1] == this.gameBoard[r - 2][c + 2] && this.gameBoard[r - 2][c + 2] == this.gameBoard[r - 3][c + 3]) {
                        this.setWinner(r, c);
                        return;
                    }
                }
            }
        }
    }

    setWinner(r, c) {
        let winner = document.getElementById('winner');
        if (this.gameBoard[r][c] == this.player1.color) {
            winner.textContent = 'The Player Wins!!!';
        } else {
            winner.textContent = 'The Computer wins!';
        }
        this.gameOver = true;
    }

}


window.onload = function () {
    new ConnectFour();
}

