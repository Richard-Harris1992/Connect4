
/*
****************** Checklist**************
Make styling prettier / add more to this
    -drop winner display further down
    -change font-size/ color / font


****CURRENT BUGS ********
Why is computer winning without winning. --seems to be working correctly, maybe I missed the win.


add a timeout fxn on player move to slow down the decision making, better UI <- only returns 1 something to do with "this".
****Bonus***
add a check for a win on the minimax function to actively search to win.
maybe turn this into an actual minimax or at least go another layer deep.
*/



class Player {
    constructor(rows, cols) {
        this.name = 'Player';
        this.color = 'Red';
        this.next = null
        this.rows = rows;
        this.cols = cols;
    }

    getCoords(htmlNode) {

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
            return coord;
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
            for (let c = 0; c < this.cols - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (gameArray[r][c] == gameArray[r][c + 1] && gameArray[r][c + 1] == gameArray[r][c + 2] && gameArray[r][c + 2] == gameArray[r][c + 3]) {
                    return true;
                }
            }
        }

        //Horizontally left;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 3; c++) { //-3 is to allow checking 3 ahead without going out of bounds on the array.
                if (gameArray[r][c] == gameArray[r][c - 1] && gameArray[r][c - 1] == gameArray[r][c - 2] && gameArray[r][c - 2] == gameArray[r][c - 3]) {
                    return true;
                }
            }
        }

        // Vertically
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.cols; c++) {

                if (gameArray[r][c] == gameArray[r + 1][c] && gameArray[r + 1][c] == gameArray[r + 2][c] && gameArray[r + 2][c] == gameArray[r + 3][c]) {
                    return true;
                }

            }
        }

        //Diagonally-Left


        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                if (gameArray[r][c] == gameArray[r + 1][c + 1] && gameArray[r + 1][c + 1] == gameArray[r + 2][c + 2] && gameArray[r + 2][c + 2] == gameArray[r + 3][c + 3]) {
                    return true;
                }
            }
        }

        //Diagonaally-Right

        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                if (gameArray[r][c] == gameArray[r - 1][c + 1] && gameArray[r - 1][c + 1] == gameArray[r - 2][c + 2] && gameArray[r - 2][c + 2] == gameArray[r - 3][c + 3]) {
                    return true;
                }
            }
        }


        return false;
    }

    playerDecision(htmlNode, gameBoard, availMoves) {

        // let playerResult = coords or null
        //getcoords gets coords from click event and returns row and col
        let playerResult;
        let coords = this.getCoords(htmlNode);
        //sinkcoin =sets coord updates avail row and return coords
        playerResult = this.applyToBoard(this.sinkCoin(coords, availMoves), gameBoard);

        //applytoboard applies changes to board and gameboard array, if there is a winner, return true. if true return coords else null
        return playerResult
    }
}

class Computer extends Player {
    constructor(rows, cols) {
        super(rows, cols);
        this.name = 'Computer';
        this.color = 'Yellow';
        this.next = null;
    }

    playerDecision(gameBoard, availMoves) {
        let result;
        let arrayOfChoices = [...this.availableMovesForComputer(availMoves)];
       
        
        let aWin = this.computerCheck(gameBoard, arrayOfChoices, 'Yellow');
        if(aWin != undefined) {
            result = aWin;
        }

        let aLoss = this.computerCheck(gameBoard, arrayOfChoices, 'Red');
        if(aLoss != undefined) {
            result = aLoss;
        }
      
        if(aWin == undefined && aLoss == undefined) {
            result = arrayOfChoices[Math.floor(Math.random() * arrayOfChoices.length)];
        }
        console.log(result)
        this.updateAvailableCoordinates(result, availMoves);
        result = this.applyToBoard(result, gameBoard);
        return result;
    }

    computerCheck(gameBoard, arrayOfChoices, color) {
        let finalRow;
        let finalCol;

        let currentState = gameBoard.map(a => Object.assign({}, a))
        //This loops through all available moves and blocks red if the move in question would cause a loss;

        for (let i = 0; i < arrayOfChoices.length; i++) {

            let row = arrayOfChoices[i][0];
            let col = arrayOfChoices[i][1];
            let prevElement = currentState[row][col];

            currentState[row][col] = color;

            let winner = this.checkWinner(currentState); //need to move into player class

            if (winner) {
                finalRow = row;
                finalCol = col;
                return [finalRow, finalCol];
            } else {
                currentState[row][col] = prevElement;
            }
        }
    }

    availableMovesForComputer(availMoves) {

        let allValidMoves = [];
        for (let columnIndex = 0; columnIndex < availMoves.length; columnIndex++) {

            let c = columnIndex;
            let r = availMoves[columnIndex];

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
        this.rows = 6; // y-axis
        this.columns = 7; //x axis
        this.player1 = new Player(this.rows, this.columns);
        this.player2 = new Computer(this.rows, this.columns);
        this.currentPlayer = this.player1;
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
        let playerResult = this.player1.playerDecision(htmlNode, this.gameBoard, this.availableMoves);

        if (playerResult != null) {
            this.declareWinner(playerResult);
            return
        } else {
            this.counter++
            this.checkForDraw();
            this.currentPlayer = this.currentPlayer.next;
        }

        let computerResult = this.player2.playerDecision(this.gameBoard, this.availableMoves);

        if (computerResult != null) {
            this.declareWinner(computerResult);
            return
        } else {
            this.counter++
            this.checkForDraw();
            this.currentPlayer = this.currentPlayer.next;
        }
    }

    declareWinner(coord) {
        let r = coord[0];
        let c = coord[1];
        console.log([r, c])
        console.log(this.gameBoard[r][c])
        let winner = document.getElementById('winner');
        winner.style.color = 'white';

        if (this.gameBoard[r][c] == this.player1.color) {
            winner.textContent = 'The Player Wins!';
            winner.style.color = 'red';
            this.gameOver = true;
            this.turnOnModal()

        }

        if (this.gameBoard[r][c] == this.player2.color) {
            winner.textContent = 'The Computer wins!';
            winner.style.color = 'yellow';
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


