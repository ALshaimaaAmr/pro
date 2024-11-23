let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // X يبدأ أولاً
let gameOver = false;
let mode = '';
let level = 'easy'; // المستوى الافتراضي هو سهل

function selectMode(selectedMode) {
    mode = selectedMode;
    document.querySelector('.mode-selection').classList.add('hidden');
    if (mode === 'computer') {
        document.getElementById('difficulty-selection').classList.remove('hidden');
    } else {
        startGame('easy'); // إذا كان اللعب مع شخص آخر، نبدأ بدون الحاجة لاختيار الصعوبة
    }
}

function startGame(selectedLevel) {
    level = selectedLevel;
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    document.getElementById('board').classList.remove('hidden');
    document.getElementById('game-status').classList.add('hidden');
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = '';
        cell.style.pointerEvents = 'auto';
    });
    if (mode === 'computer' && currentPlayer === 'X') {
        setTimeout(computerMove, 500); // تحرك الكمبيوتر أولاً إذا كان هو اللاعب الثاني
    }
}

function makeMove(index) {
    if (gameOver || board[index] !== '') return;
    board[index] = currentPlayer;
    document.querySelectorAll('.cell')[index].innerText = currentPlayer;
    document.querySelectorAll('.cell')[index].style.pointerEvents = 'none';

    if (checkWinner(currentPlayer)) {
        gameOver = true;
        document.getElementById('winner').innerText = `${currentPlayer} فاز!`;
        document.getElementById('game-status').classList.remove('hidden');
    } else if (board.every(cell => cell !== '')) {
        gameOver = true;
        document.getElementById('winner').innerText = 'تعادل!';
        document.getElementById('game-status').classList.remove('hidden');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (mode === 'computer' && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
}

function checkWinner(player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination => 
        combination.every(index => board[index] === player)
    );
}

function computerMove() {
    let availableMoves = board.map((value, index) => value === '' ? index : null).filter(value => value !== null);
    let move = null;

    if (level === 'easy') {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else if (level === 'medium') {
        move = findBestMove();
    } else if (level === 'hard') {
        move = minimax(board, 'O').index;
    }

    makeMove(move);
}

function findBestMove() {
    // خوارزمية لاختيار الخطوة الأفضل للمستوى المتوسط
    return Math.floor(Math.random() * board.length);
}

function minimax(board, player) {
    const availableMoves = board.map((value, index) => value === '' ? index : null).filter(value => value !== null);

    if (checkWinner('X')) return { score: -10 };
    if (checkWinner('O')) return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };

    let moves = [];
    availableMoves.forEach(move => {
        let newBoard = [...board];
        newBoard[move] = player;
        let result = minimax(newBoard, player === 'O' ? 'X' : 'O');
        moves.push({ index: move, score: result.score });
    });

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }

    return bestMove;
}

function resetGame() {
    startGame(level); // إعادة اللعبة مع نفس مستوى الصعوبة
}
