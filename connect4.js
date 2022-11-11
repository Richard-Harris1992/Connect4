
/*
****************** Checklist**************
Make styling prettier / add more to this
Add slots left / if 42 change textContent to a draw
Try to break all these long pieces of code to smaller functions. / clean this stuff up.

****Bonus***
add a check for a win on the minimax function to actively search to win.
maybe turn this into an actual minimax or at least go another layer deep.
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
        let coords = this.sinkCoin(htmlNode);
        let row = coords[0];
        let col = coords[1];

        let slotIndex = this.gameBoard[row][col];

        slotIndex.htmlElement.classList.add(this.player1.color);
        this.gameBoard[row][col] = 'Red'

        let winner = this.checkWinner(this.gameBoard);

        if (winner) {
            return [row, col];
        }

        this.currentPlayer = this.player2;
        return;
    }
   
    computerMove() {
        let slotIndex;
        let row;
        let col;

        let allValidMoves = [...this.availableMovesForComputer()];
        let isThereAnEndMove = this.computerChoice()
       
        if(isThereAnEndMove == false) {
            let computerChoice = allValidMoves[Math.floor(Math.random() * allValidMoves.length)];
            console.log(computerChoice)
            let coords = this.sinkCoin(computerChoice);
            row = coords[0];
            col = coords[1];
            slotIndex = this.gameBoard[row][col];

        } else {
            row = isThereAnEndMove[0];
            col = isThereAnEndMove[1];
            slotIndex = this.gameBoard[row][col];
            this.updateCoordinates(row, col);
            console.log(this.availableMoves)
        }
        
        slotIndex.htmlElement.classList.add(this.player2.color);
        this.gameBoard[row][col] = 'Yellow'
        let winner = this.checkWinner(this.gameBoard);

        if (winner) {
            return [row, col];
        }
        
        this.currentPlayer = this.player1;
        return;

    }
   
    availableMovesForComputer() {
        let allValidMoves = [];
        for (let columnIndex = 0; columnIndex < this.availableMoves.length; columnIndex++) {

            let c = columnIndex;
            let r = this.availableMoves[columnIndex];

            if (r >= 0) {
                allValidMoves.push(this.gameBoard[r][c]) //this pushes a coordinate of each available move to check.
            }
        }
        console.log(allValidMoves)
        return allValidMoves;
    }

    sinkCoin(htmlNode) {
        let coords = htmlNode.id.split('-'); //'0-0' -> [0,0]

        let row = parseInt(coords[0]);
        let col = parseInt(coords[1]);

        row = this.availableMoves[col]; //Places the coin in the lowest row on that column
        //This prevents an OOB Exception
        if (row < 0) {
            return
        }

        let currentMove = [row, col];
        this.updateCoordinates(row, col);
        return currentMove;
    }

    updateCoordinates(row, col) {
        row--;
        this.availableMoves[col] = row;
    }

    checkWinner(gameArray) { 

        //Horizontally right
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (gameArray[r][c] != ' ') {
                    if (gameArray[r][c] == gameArray[r][c + 1] && gameArray[r][c + 1] == gameArray[r][c + 2] && gameArray[r][c + 2] == gameArray[r][c + 3]) {
                        return true;
                    }
                }
            }
        }

        //Horizontally left;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (gameArray[r][c] != ' ') {
                    if (gameArray[r][c] == gameArray[r][c - 1] && gameArray[r][c - 1] == gameArray[r][c - 2] && gameArray[r][c - 2] == gameArray[r][c - 3]) {
                        return true;
                    }
                }
            }
        }

        // Vertically
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns; c++) {
                if (gameArray[r][c] != ' ') {
                    if (gameArray[r][c] == gameArray[r + 1][c] && gameArray[r + 1][c] == gameArray[r + 2][c] && gameArray[r + 2][c] == gameArray[r + 3][c]) {
                        return true;
                    }
                }
            }
        }

        //Diagonally-Left


        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (gameArray[r][c] != ' ') {
                    if (gameArray[r][c] == gameArray[r + 1][c + 1] && gameArray[r + 1][c + 1] == gameArray[r + 2][c + 2] && gameArray[r + 2][c + 2] == gameArray[r + 3][c + 3]) {
                        return true;
                    }
                }
            }
        }

        //Diagonaally-Right

        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (gameArray[r][c] != ' ') {
                    if (gameArray[r][c] == gameArray[r - 1][c + 1] && gameArray[r - 1][c + 1] == gameArray[r - 2][c + 2] && gameArray[r - 2][c + 2] == gameArray[r - 3][c + 3]) {
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

    computerChoice() {
       // let gameboardArray = [...this.gameBoard]; // this is a hard copied value of the current gameboard array.
        let currentState = this.gameBoard.map(a => Object.assign({}, a))
        let availableMoves = [...this.availableMovesForComputer()];
        let nextPlay = [];
        

        //get current state of game.
        //check each available move (loop) and put the player marker in its place.
            //if this causes the player to win, put the marker in its spot.
            //else random.

        for(let i = 0; i < availableMoves.length; i++) {
            let prevElement = availableMoves[i];
            //console.log(`this is pre move ${prevElement}`);
            let coords = availableMoves[i].id.split('-');
            let row = parseInt(coords[0]);
            let col = parseInt(coords[1]);
           
            currentState[row][col] = 'Red';
            let winner = this.checkWinner(currentState);
            //console.log(winner)
            if(winner) {
                nextPlay.push(row);
                nextPlay.push(col);
                return nextPlay;
            } else {
                currentState[row][col] = prevElement;
            }
        }
        //console.log(currentState);
        return false;
        

    }
}


window.onload = function () {
    new ConnectFour();
}

