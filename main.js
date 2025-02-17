let board = Array(9).fill(null);
let isXNext = true;
let isAgainstComputer = false;
let history = []; 
let isHumanSelected = true; 
const cursor = document.querySelector(".custom-cursor");
const boardTracking = document.querySelector(".board");

document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.1, 
        ease: "power2.out" 
    });
});

boardTracking.addEventListener("mouseenter", () => {
    gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.2 });
    document.body.style.cursor = "none"; 
});

boardTracking.addEventListener("mouseleave", () => {
    gsap.to(cursor, { opacity: 0, duration: 0.2 });
    document.body.style.cursor = "auto"; 
});

function createBoard() {
    const boardElement = document.querySelector('.board');
    boardElement.innerHTML = '';

    board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (value) cell.classList.add(value === "X" ? "x" : "o");
        cell.textContent = value || '';
        cell.addEventListener('click', () => handleMove(index));
        boardElement.appendChild(cell);
    });

    document.getElementById('status').textContent = checkWinner() ? `Winner: ${checkWinner()}` : `Turn: ${isXNext ? 'X' : 'O'}`;
}

function handleMove(index) {
    if (board[index] || checkWinner()) return;

    history.push([...board]); //current state before making a move

    board[index] = isXNext ? "X" : "O";
    isXNext = !isXNext;
    createBoard();

    let winner = checkWinner();
    if (winner) {
        document.getElementById('status').textContent = `Winner: ${winner}!`;
    } else if (!board.includes(null)) {
        document.getElementById('status').textContent = "It's a draw!";
    }

    if (isAgainstComputer && !isXNext) {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) { // If cell is empty
            board[i] = "O"; 
            let score = minimax(board, 0, false); 
            board[i] = null; 

            if (score > bestScore) { // Choose the best move
                bestScore = score;
                move = i;
            }
        }
    }

    board[move] = "O"; 
    isXNext = true;
    createBoard();

    let winner = checkWinner();
    if (winner) {
        document.getElementById('status').textContent = `Winner: ${winner}!`;
    } else if (!board.includes(null)) {
        document.getElementById('status').textContent = "It's a draw!";
    }
}

function minimax(board, depth, isMaximizing) {
    let winner = checkWinner();
    if (winner) return winner === "O" ? 1 : winner === "X" ? -1 : 0; 

    if (!board.includes(null)) return 0; // If no more moves, it's a draw

    if (isMaximizing) { 
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else { 
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]  
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function resetGame() {
    board = Array(9).fill(null);
    isXNext = true;
    createBoard();
}

function undoMove() {
    if (history.length > 0) {
        board = history.pop(); 
        isXNext = !isXNext; 

        if (isAgainstComputer && !isXNext && history.length > 0) {
            board = history.pop(); 
            isXNext = true; 
        }

        createBoard();
    }
}

function toggleGameMode() {
    isHumanSelected = !isHumanSelected; 
    isAgainstComputer = !isHumanSelected; 

    gsap.to(".toggle-circle", { x: isHumanSelected ? "0%" : "100%", duration: 0.3, ease: "linear" });

    gsap.to("#toggle-item1", { 
        scale: isHumanSelected ? 1.05 : 0.95, 
        opacity: isHumanSelected ? 1 : 0.5, 
        duration: 0.3 
    });

    gsap.to("#toggle-item2", { 
        scale: isHumanSelected ? 0.95 : 1.05, 
        opacity: isHumanSelected ? 0.5 : 1, 
        duration: 0.3 
    });

    // Reset 
    resetGame();

    if (isAgainstComputer && !isXNext) {
        setTimeout(computerMove, 500);
    }
}

createBoard();


