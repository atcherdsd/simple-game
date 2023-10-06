//----1. Определение начального СТАТУСА игры и дисплея------

let gameStarted = true;
let cellsState = ['','','','','','','','','',];
let currentPlayer = 'X';
let moveCount = 0;
let wonX = 0;
let wonO = 0;
let draw = 0;
let gamesCount = 0;

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const displayMessage = document.querySelector('.game-message');
const wonMessage = () => `Player '${currentPlayer}' has won!<br>
    Game over in ${moveCount} moves`;
const drawMessage = () => `Nobody managed to win!<br>
    Game over in ${moveCount} moves`;
const currentPlayerTurn = () => `Player '${currentPlayer}' makes a move`;
displayMessage.innerHTML = currentPlayerTurn();

const textWonX = document.querySelector('.cell-wonX');
const textWonO = document.querySelector('.cell-wonO');
const textDraw = document.querySelector('.cell-draw');
const totalCount = document.querySelector('.games-count');

//----2. Определение возможности КЛИКА по ЯЧЕЙКЕ----

function possibleCellClick(cellEvent) {
    const checkedCell = cellEvent.target;
    const checkedCellIndex = parseInt(checkedCell.getAttribute('data-cell'));
    
    if(cellsState[checkedCellIndex] !== '' || !gameStarted)
        return
    
    moveMade(checkedCell, checkedCellIndex);
    gameProcess();
}

//----3. Запись хода игрока "Х" и "О"--------

function moveMade (checkedCell, checkedCellIndex) {
    cellsState[checkedCellIndex] = currentPlayer;
    
    if(currentPlayer === 'X') {
        checkedCell.classList.add('cross')
    } else
        checkedCell.classList.add('zero')
    
    moveCount++;
}

//----4. Переход ХОДА-----

function playerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    displayMessage.innerHTML = currentPlayerTurn();
}

//----5. ПРОЦЕСС ИГРЫ-----

function gameProcess () {
    let gameWon = false;

    for(let i = 0; i <= winCombinations.length-1; i++) {
        const winItem = winCombinations[i];

        let cell1 = cellsState[winItem[0]];
        let cell2 = cellsState[winItem[1]];
        let cell3 = cellsState[winItem[2]];
        if (cell1 === '' || cell2 === '' || cell3 === '') 
            continue;
        if (cell1 === cell2 && cell2 === cell3) {

            if (cell1 === 'X') {                
                gameWon = true;
                wonX++;
                localStorage.setItem('total Wins X', wonX);
                textWonX.innerHTML = wonX;
                gamesCount++;
                totalCount.innerHTML = gamesCount;
                getLocalStorage();
                break;
            }
            else if (cell1 === 'O') {
                gameWon = true;
                wonO++;
                localStorage.setItem('total Wins O', wonO);
                textWonO.innerHTML = wonO;
                gamesCount++;
                totalCount.innerHTML = gamesCount;
                getLocalStorage();
                break;
            }
        }
    }    
    
    if (gameWon) {
        displayMessage.innerHTML = wonMessage();
        displayMessage.classList.add('grow');
        gameStarted = false;
        return;
    }

    let gameDraw = !cellsState.includes('');
    if (gameDraw) {
        displayMessage.innerHTML = drawMessage();
        displayMessage.classList.add('grow');
        draw++;
        localStorage.setItem('total Draw', draw);
        textDraw.innerHTML = draw;
        gamesCount++;
        totalCount.innerHTML = gamesCount;
        getLocalStorage();
        gameStarted = false;
        return;
    }
   
    playerChange();
}

//----6. ПЕРЕЗАПУСК игры-----

function restartGame() {
    gameStarted = true;
    cellsState = ['','','','','','','','','',];
    currentPlayer = 'X';
    moveCount = 0;

    displayMessage.innerHTML = currentPlayerTurn();
    displayMessage.classList.remove('grow');
    document.querySelectorAll('.span').forEach(span =>
        span.classList.remove('cross', 'zero'));
}

//----7. Определение СЛУШАТЕЛЕЙ для функций игры----

document.querySelectorAll('.cell').forEach(cell => 
    cell.addEventListener('click', possibleCellClick));

document.querySelector('.button')
    .addEventListener('click', () => {
        setTimeout(restartGame, 300)
    });


//----8. Добавление функций и класса active ГЛАВНОЙ КНОПКЕ------

const mainBtn = document.querySelector('.button');
const gameArea = document.querySelector('.game-area');

function pressBtn(event) {
    event.target.classList.add('active');
    
    setTimeout(function(){
        event.target.classList = 'button'
    }, 200)
    
};

function getRotate(){
    gameArea.classList.add('animation');
    setTimeout(function(){
        gameArea.classList = 'game-area'
    }, 1000)
}

mainBtn.addEventListener('click', pressBtn);
mainBtn.addEventListener('click', getRotate);


//------9. Работа с параметрами в LOCAL STORAGE-----

function getLocalStorage() {
    if (localStorage.getItem('total Wins X')) {
        let forX = localStorage.getItem('total Wins X');
        const totalWinX = document.querySelector('.record-wonX');
        totalWinX.textContent = forX;
    }

    if (localStorage.getItem('total Wins O')) {
        let forO = localStorage.getItem('total Wins O');
        const totalWinO = document.querySelector('.record-wonO');
        totalWinO.textContent = forO;
    }

}
window.addEventListener('load', getLocalStorage);
