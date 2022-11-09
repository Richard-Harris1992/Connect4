

//maybe see how I can break these methods into smaller methods.
//space for minimax

















class Player {
    constructor() {
        this.name = 'Player';
        this.color = 'Red';
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
        this.currentColumns = [5, 5, 5, 5, 5, 5, 5]; //this array keeps the coins from floating, they will fall into the bottom most row.
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



    addColorChangeClickEvent() {

        let flattenedGameboardArray = this.gameBoard.flat()
        flattenedGameboardArray.forEach(coin => {

            let htmlNode = document.getElementById(coin.id);
            htmlNode.addEventListener('click', (e) => {
                if (this.gameOver) {
                    return;
                }


                let coords = htmlNode.id.split('-'); //'0-0' -> [0,0]

                let row = parseInt(coords[0]);
                let col = parseInt(coords[1]);

                row = this.currentColumns[col];
                if (row < 0) {
                    return;
                }

                this.gameBoard[row][col] = this.currentPlayer.color;
                let coin = document.getElementById(`${row}-${col}`);
                if (this.currentPlayer == this.player1) {
                    coin.classList.add(this.player1.color);
                    this.currentPlayer = this.player2;
                } else {
                    coin.classList.add(this.player2.color);
                    this.currentPlayer = this.player1;
                }

                row--; //updating row height for the column
                this.currentColumns[col] = row; //update array

                this.checkWinner();
            }); //end eventListener function
        });

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

