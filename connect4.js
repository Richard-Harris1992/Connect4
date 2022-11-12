
/*
****************** Checklist**************
Make styling prettier / add more to this



Try to break all these long pieces of code to smaller functions. / clean this stuff up.
add a timeout fxn on player move to slow down the decision making, better UI
****Bonus***
add a check for a win on the minimax function to actively search to win.
maybe turn this into an actual minimax or at least go another layer deep.
*/
d


class Player {
    constructor() {
        this.name = 'Player';
        this.color = 'Red';
        this.next = null
    }

    playerMove(htmlNode) {

        let coords = htmlNode.id.split('-'); //'0-0' -> [0,0]
        let row = parseInt(coords[0]);
        let col = parseInt(coords[1]);
        return [row, col];
    }

}
class Computer extends Player {
    constructor() {
        super();
        this.name = 'Computer';
        this.color = 'Yellow';
        this.next = null
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
        this.counter = 0;

    }

    createBoard() {
        this.player1.next = this.player2; //node structure to get next player.
        this.player2.next = this.player1;


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
                } else {
                    this.playRound(htmlNode);
                }
            }); //end eventListener function
        });

    }

    playRound(htmlNode = null) {
        let playerResult = this.playerMakesMove(htmlNode);

        if (playerResult != null) {
            this.declareWinner(playerResult);
        } else {
            this.checkForDraw();
        }

        let computerResult = this.playerMakesMove();

        if (computerResult != null) {
            this.declareWinner(computerResult);
        } else {
            this.checkForDraw();
        }



    }

    playerMakesMove(htmlNode = null) {
        let playerResult;

        if (this.currentPlayer == this.player1) {
            playerResult = this.applyToBoard(this.sinkCoin(this.player1.playerMove(htmlNode)));
            return playerResult
        } else {
            playerResult = this.computerMove(); //seems if choice is true it doesnt place it

            return playerResult;
        }
    }

    computerMove() {

        let arrayOfChoices = [...this.availableMovesForComputer()];
        let computerDecision = this.computerAutoPlay()

        if (computerDecision == false) {
            let computerChoice = arrayOfChoices[Math.floor(Math.random() * arrayOfChoices.length)];
            this.updateAvailableCoordinates(computerChoice);
            let result = this.applyToBoard(computerChoice);
            return result;


        } else {
            this.updateAvailableCoordinates(computerDecision);
            let result = this.applyToBoard(computerDecision);
            return result;
        }
    }

    computerAutoPlay() {
        let finalRow;
        let finalCol;

        let currentState = this.gameBoard.map(a => Object.assign({}, a))
        let availableMoves = [...this.availableMovesForComputer()];

        //This loops through all available moves and blocks red if the move in question would cause red to win.

        for (let i = 0; i < availableMoves.length; i++) {

            let row = availableMoves[i][0];
            let col = availableMoves[i][1];
            let prevElement = currentState[row][col];

            currentState[row][col] = 'Red';

            let winner = this.checkWinner(currentState);
            if (winner) {
                finalRow = row;
                finalCol = col;
                return [finalRow, finalCol];
            } else {
                currentState[row][col] = prevElement;
            }
        }

        return false;


    }

    applyToBoard(coord) {
        if (this.currentPlayer == this.player2) {

        }
        let row = coord[0];
        let col = coord[1];


        this.gameBoard[row][col].htmlElement.classList.add(this.currentPlayer.color);
        this.gameBoard[row][col] = this.currentPlayer.color



        let winner = this.checkWinner(this.gameBoard);

        if (winner) {
            return [row, col];
        }

        this.currentPlayer = this.currentPlayer.next;
        this.counter++
        return;
    }

    sinkCoin(coord) {
        let row = coord[0];
        let col = coord[1];

        //Places the coin in the lowest row on that column
        row = this.availableMoves[col];

        //This prevents an OOB Exception
        if (row < 0) {
            return
        }

        let currentMove = [row, col];
        this.updateAvailableCoordinates([row, col]);
        return currentMove;
    }

    updateAvailableCoordinates(coord) {
        let row = coord[0];
        let col = coord[1];
        row--;
        this.availableMoves[col] = row;
    }

    availableMovesForComputer() {
        let allValidMoves = [];
        for (let columnIndex = 0; columnIndex < this.availableMoves.length; columnIndex++) {

            let c = columnIndex;
            let r = this.availableMoves[columnIndex];

            if (r >= 0) {
                allValidMoves.push([r, c])
            }
        }
        return allValidMoves;
    }

    checkWinner(gameArray) {

        //Horizontally right
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (gameArray[r][c] == gameArray[r][c + 1] && gameArray[r][c + 1] == gameArray[r][c + 2] && gameArray[r][c + 2] == gameArray[r][c + 3]) {
                    return true;
                }
            }
        }

        //Horizontally left;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (gameArray[r][c] == gameArray[r][c - 1] && gameArray[r][c - 1] == gameArray[r][c - 2] && gameArray[r][c - 2] == gameArray[r][c - 3]) {
                    return true;
                }
            }
        }

        // Vertically
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns; c++) {
                if (gameArray[r][c] == gameArray[r + 1][c] && gameArray[r + 1][c] == gameArray[r + 2][c] && gameArray[r + 2][c] == gameArray[r + 3][c]) {
                    return true;
                }
            }
        }

        //Diagonally-Left


        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (gameArray[r][c] == gameArray[r + 1][c + 1] && gameArray[r + 1][c + 1] == gameArray[r + 2][c + 2] && gameArray[r + 2][c + 2] == gameArray[r + 3][c + 3]) {
                    return true;
                }
            }
        }

        //Diagonaally-Right

        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (gameArray[r][c] == gameArray[r - 1][c + 1] && gameArray[r - 1][c + 1] == gameArray[r - 2][c + 2] && gameArray[r - 2][c + 2] == gameArray[r - 3][c + 3]) {
                    return true;
                }
            }
        }


        return false;
    }

    declareWinner(coord) {
        let r = coord[0];
        let c = coord[1];

        let winner = document.getElementById('winner');
        winner.style.color = 'white';

        if (this.gameBoard[r][c] == this.player1.color) {
            winner.textContent = 'The Player Wins!';
            this.gameOver = true;
            this.turnOnModal()

        }

        if (this.gameBoard[r][c] == this.player2.color) {
            winner.textContent = 'The Computer wins!';
            this.gameOver = true;
            this.turnOnModal()

        }
    }

    checkForDraw() {
        let winner = document.getElementById('winner');
        winner.style.color = 'white'

        if (this.counter == 42) {
            winner.textContent = 'The game is a draw!';
            this.gameOver = true;
            this.turnOnModal()
        }
    }

    turnOnModal() {
        let modal = document.getElementById('playAgainModal');
        modal.classList = 'show';
    }

}

    let playAgainBtn = document.querySelector('.yes');
    playAgainBtn.addEventListener('click', function (e) {
        let hideModal = document.getElementById('playAgainModal');
        window.location.reload(false);
        hideModal.classList = 'hide';
    });



    let exitBtn = document.querySelector('.no');
    exitBtn.addEventListener('click', function (e) {
        let hideMode = document.getElementById('playAgainModal');
        hideMode.classList = 'hide';
    });





window.onload = function () {
    let game = new ConnectFour;
    
}


