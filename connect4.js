
/*
****************** Checklist**************
Make styling prettier / add more to this



Try to break all these long pieces of code to smaller functions. / clean this stuff up.
add a timeout fxn on player move to slow down the decision making, better UI
****Bonus***
add a check for a win on the minimax function to actively search to win.
maybe turn this into an actual minimax or at least go another layer deep.
*/



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

    applyToBoard(coord, gameBoard) {

        let row = coord[0];
        let col = coord[1];


        gameBoard[row][col].htmlElement.classList.add(this.color);
        gameBoard[row][col] = this.color



        let winner = this.checkWinner(gameBoard);

        if (winner) {
            return [row, col];
        }

        return;
    }

    sinkCoin(coord, availMoves) {
        let row = coord[0];
        let col = coord[1];

        //Places the coin in the lowest row on that column
        row = availMoves[col];

        //This prevents an OOB Exception
        if (row < 0) {
            return
        }

        let currentMove = [row, col];
        this.updateAvailableCoordinates([row, col], availMoves);
        return currentMove;
    }

    updateAvailableCoordinates(coord, availMoves) {
        let row = coord[0];
        let col = coord[1];
        row--;
        availMoves[col] = row;
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

    playerMakesMove(htmlNode = null, gameBoard, availMoves) {
        let playerResult;
        let coords = this.playerMove(htmlNode);

        playerResult = this.applyToBoard(this.sinkCoin(coords, availMoves), gameBoard);
        return playerResult
    }
}

class Computer extends Player {
    constructor() {
        super();
        this.name = 'Computer';
        this.color = 'Yellow';
        this.next = null
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

    //I might move gameOver / put set winner inside of player class check winner fxn

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
        let playerResult = this.player1.playerMakesMove(htmlNode, this.gameBoard, this.availableMoves);
       
        if (playerResult != null) {
            this.declareWinner(playerResult);
        } else {
            this.checkForDraw();
            this.currentPlayer = this.currentPlayer.next; 
            this.counter++
        }
     

        let computerResult = this.playerMakesMove();

        if (computerResult != null) {
            this.declareWinner(computerResult);
        } else {
            this.checkForDraw();
            this.currentPlayer = this.currentPlayer.next; 
            this.counter++
        }



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


