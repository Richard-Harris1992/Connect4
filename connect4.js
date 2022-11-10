

//maybe see how I can break these methods into smaller methods.
//space for minimax

/*after each turn update currentGameStateMethod 'Red', 'Yellow' or 'Coin' <--representing an empty slot

const currentEmptyCells = (CurrentGameStateMethod()) => currentGameStateMethod().filter(slots => slots == 'Coin')

I think just returning the gameOver prop will satisfy the checking if there is a winner. step 5


I need a function that will run through empty slots and see if they pick one value then they will win.

I think for to pass the either current state or available state it would look like

************No pieces left board for draws*****************************

end goal is flexibility of methods needed to propery use minimax.


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
        this.gameBoardBuilder = this.createBoard();
    }

    createBoard() {

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
        this.clickEvent();

    }

    clickEvent() { 

        let flattenedGameboardArray = this.gameBoard.flat()
        flattenedGameboardArray.forEach(coin => {

            let htmlNode = document.getElementById(coin.id);
            htmlNode.addEventListener('click', (e) => {
                if (this.gameOver) {
                    return;
                }
                this.playRound(htmlNode);  
            }); //end eventListener function
        });

    }

    playRound(htmlNode = null) {
        let playerCoords = this.playerMove(htmlNode);
        if( playerCoords != null) {
           this.declareWinner(playerCoords[0], playerCoords[1]);
           return
        }
        
       
        let computerCoords = this.computerMove();
        if( computerCoords != null) {
            this.declareWinner(computerCoords[0], computerCoords[1])
            return
         }
    }

    playerMove(htmlNode) {
        let coords = this.updateCoordinates(htmlNode);
        let row = coords[0];
        let col = coords[1];

        let slotIndex = this.gameBoard[row][col];

        slotIndex.htmlElement.classList.add(this.player1.color);
        this.gameBoard[row][col] = 'Red'

        let winner = this.checkWinner();

        if (winner) {
            return [row, col];
        }

        this.currentPlayer = this.player2;
        return;
    }

    computerMove() {
        let allValidMoves = [];
        for (let columnIndex = 0; columnIndex < this.availableMoves.length; columnIndex++) {

            let c = columnIndex;
            let r = this.availableMoves[columnIndex];

            if (r > 0) {
                allValidMoves.push(this.gameBoard[r][c]) //this pushes a coordinate of each available move to check.
            }
        }

        let computerChoice = allValidMoves[Math.floor(Math.random() * allValidMoves.length)];
        let coords = this.updateCoordinates(computerChoice);
        let row = coords[0];
        let col = coords[1];

        let slotIndex = this.gameBoard[row][col];

        slotIndex.htmlElement.classList.add(this.player2.color);
        this.gameBoard[row][col] = 'Yellow'

        let winner = this.checkWinner();

        if (winner) {
            return [row, col];
        }

        this.currentPlayer = this.player1;
        return;

    }

    updateCoordinates(htmlNode) {
        let coords = htmlNode.id.split('-'); //'0-0' -> [0,0]

        let row = parseInt(coords[0]);
        let col = parseInt(coords[1]);

        row = this.availableMoves[col]; //Places the coin in the lowest row on that column
        //This prevents an OOB Exception
        if (row < 0) {
            return
        }

        let currentMove = [row, col];
        row--; //updating row height for the column
        this.availableMoves[col] = row; //update array
        return currentMove;
    }

    checkWinner() { //maybe see why diag-right is incorrect, but also see if I can just put gameboard[row][col] without any errors.

        //Horizontally right
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r][c + 1] && this.gameBoard[r][c + 1] == this.gameBoard[r][c + 2] && this.gameBoard[r][c + 2] == this.gameBoard[r][c + 3]) {
                        return true;
                    }
                }
            }
        }

        //Horizontally left;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r][c - 1] && this.gameBoard[r][c - 1] == this.gameBoard[r][c - 2] && this.gameBoard[r][c - 2] == this.gameBoard[r][c - 3]) {
                        return true;
                    }
                }
            }
        }

        // Vertically
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns; c++) {
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r + 1][c] && this.gameBoard[r + 1][c] == this.gameBoard[r + 2][c] && this.gameBoard[r + 2][c] == this.gameBoard[r + 3][c]) {
                        return true;
                    }
                }
            }
        }

        //Diagonally-Left


        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r + 1][c + 1] && this.gameBoard[r + 1][c + 1] == this.gameBoard[r + 2][c + 2] && this.gameBoard[r + 2][c + 2] == this.gameBoard[r + 3][c + 3]) {
                        return true;
                    }
                }
            }
        }

        //Diagonaally-Right

        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.gameBoard[r][c] != ' ') {
                    if (this.gameBoard[r][c] == this.gameBoard[r - 1][c + 1] && this.gameBoard[r - 1][c + 1] == this.gameBoard[r - 2][c + 2] && this.gameBoard[r - 2][c + 2] == this.gameBoard[r - 3][c + 3]) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    declareWinner(r, c) {
        let winner = document.getElementById('winner');
        winner.style.color = 'white';

        if (this.gameBoard[r][c] == this.player1.color) {
            winner.textContent = 'The Player Wins!!!';
            this.gameOver = true;
           
        }
        
        if (this.gameBoard[r][c] == this.player2.color) {
            winner.textContent = 'The Computer wins!';
            this.gameOver = true;
           
        }
    }

    minimax() {

        /* code here */

    }

    currentGameState() {
        return this.gameBoard.flat();
    }

    currentEmptySlots() {
        let arr = this.currentGameState();
        arr.filter(empty => typeof empty == 'object');
        return arr;
    }
}


window.onload = function () {
    new ConnectFour();
}

