const themeToggle = document.getElementById('themeToggle');
const resetButton = document.getElementById('reset');
const chess = new Chess();
let board;

function highlightLegalMoves(square) {
    const moves = chess.moves({ square, verbose: true });
    if (moves.length === 0) return;

    moves.forEach(move => {
        const squareElement = document.querySelector(`.square-${move.to}`);
        if (squareElement) {
            squareElement.classList.add('highlight');
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
}

function onDragStart(source, piece) {
    if (chess.game_over() || piece.startsWith('b')) return false; // Prevent moves for black pieces
}

function onDrop(source, target) {
    clearHighlights();
    const move = chess.move({
        from: source,
        to: target,
        promotion: 'q', // Promote to queen
    });

    if (move === null) return 'snapback';
}

function onMouseoverSquare(square) {
    highlightLegalMoves(square);
}

function onMouseoutSquare() {
    clearHighlights();
}

function initBoard() {
    board = Chessboard('board', {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoverSquare: onMouseoverSquare,
        onMouseoutSquare: onMouseoutSquare,
    });
}

resetButton.addEventListener('click', () => {
    chess.reset();
    board.start();
    clearHighlights();
});

themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'dark';

initBoard();
