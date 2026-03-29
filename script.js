const grid = document.getElementById('grid');
const size = 100;

function createGrid() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < size * size; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;


        fragment.appendChild(input);

    }

    grid.appendChild(fragment);
}

createGrid();

let currentSize = 30;
const minSize = 15;
const maxSize = 80;

window.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
        e.preventDefault();


        if (e.deltaY < 0) {
            currentSize += 2;
        } else {
            currentSize -= 2;
        }

        currentSize = Math.min(Math.max(minSize, currentSize), maxSize);


        document.documentElement.style.setProperty('--size', `${currentSize}px`);
    }
}, { passive: false });

function centerCrossword() {
    const viewport = document.querySelector('.viewport');
    const grid = document.getElementById('grid');

    const centerX = grid.offsetWidth / 2;
    const centerY = grid.offsetHeight / 2;

    const viewHalfWidth = viewport.offsetWidth / 2;
    const viewHalfHeight = viewport.offsetHeight / 2;


    viewport.scrollTo({
        left: centerX - viewHalfWidth,
        top: centerY - viewHalfHeight,
        behavior: 'instant'
    });
}

function toggleActiveCell() {
    const currentInput = document.activeElement;

    if (currentInput && currentInput.tagName === 'INPUT' && currentInput.closest('#grid')) {
        currentInput.classList.toggle('active-cell');
        currentInput.focus();
    }
}

function activateCell() {
    const currentInput = document.activeElement;
    if (currentInput && currentInput.tagName === 'INPUT') {
        currentInput.classList.add('active-cell');
        currentInput.focus();
    }
}


function deactivateCell() {
    const currentInput = document.activeElement;
    if (currentInput && currentInput.tagName === 'INPUT') {
        currentInput.classList.remove('active-cell');
        currentInput.value = "";
        currentInput.focus();
    }
}

document.getElementById('grid').addEventListener('keydown', (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        toggleActiveCell();
    }
});
const SIZE = 100;

document.getElementById('grid').addEventListener('keydown', (e) => {
    const currentInput = e.target;
    if (currentInput.tagName !== 'INPUT') return;
    const inputs = Array.from(document.querySelectorAll('#grid input'));
    const index = inputs.indexOf(currentInput);
    let nextIndex;
    switch (e.key) {
        case 'ArrowRight':
            nextIndex = index + 1;
            break;
        case 'ArrowLeft':
            nextIndex = index - 1;
            break;
        case 'ArrowDown':
            nextIndex = index + SIZE;
            break;
        case 'ArrowUp':
            nextIndex = index - SIZE;
            break;
        default:
            return;
    }

    if (inputs[nextIndex]) {
        e.preventDefault();
        inputs[nextIndex].focus();
        inputs[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
const container = document.getElementById('button-container');

function updateActiveButton(number) {
    const allButtons = document.querySelectorAll('.controls-bar button');
    allButtons.forEach(btn => btn.classList.remove('active-button'));
    if (number) {
        const targetBtn = document.querySelector(`.controls-bar button[data-btn-id="${number}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active-button');
            targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
}

document.getElementById('grid').addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT') {
        const cellNumber = e.target.getAttribute('data-number');
        updateActiveButton(cellNumber);
    }
});
for (let i = 1; i <= 50; i++) {
    const btn = document.createElement('button');
    btn.innerText = `${i}`;
    btn.setAttribute('data-btn-id', i);
    btn.onmousedown = (e) => e.preventDefault();
    btn.onclick = () => {
        const currentInput = document.activeElement;
        if (currentInput && currentInput.tagName === 'INPUT') {
            if (currentInput.hasAttribute('data-number') && currentInput.getAttribute('data-number')) {
                currentInput.removeAttribute('data-number');
            } else {
                currentInput.setAttribute('data-number', i);
                currentInput.classList.add('active-cell');
            }
            updateActiveButton(i);
        }
    };

    container.appendChild(btn);
}
const scrollContainer = document.querySelector('.controls-bar');

scrollContainer.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});
centerCrossword();
async function exportToJPG() {
    const allInputs = Array.from(document.querySelectorAll('#grid input'));
    const activeInputs = allInputs.filter(input => input.classList.contains('active-cell'));
    if (activeInputs.length === 0) {
        return;
    }
    const cellSize = 30;
    const gridCols = 100;
    const padding = 60;
    let minRow = Infinity,
        maxRow = -Infinity;
    let minCol = Infinity,
        maxCol = -Infinity;
    allInputs.forEach((input, index) => {
        if (input.classList.contains('active-cell')) {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;
            minRow = Math.min(minRow, row);
            maxRow = Math.max(maxRow, row);
            minCol = Math.min(minCol, col);
            maxCol = Math.max(maxCol, col);
        }
    });
    const outCols = (maxCol - minCol) + 1;
    const outRows = (maxRow - minRow) + 1;
    const canvas = document.createElement('canvas');
    canvas.width = outCols * cellSize + (padding * 2);;
    canvas.height = outRows * cellSize + (padding * 2);;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    allInputs.forEach((input, index) => {
        if (input.classList.contains('active-cell')) {
            const row = Math.floor(index / 100);
            const col = index % 100;

            const x = ((col - minCol) * cellSize) + padding;
            const y = ((row - minRow) * cellSize) + padding;

            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cellSize, cellSize);

            const num = input.getAttribute('data-number');
            if (num) {
                ctx.fillStyle = "black";
                ctx.font = "bold 11px Arial";
                ctx.fillText(num, x + 3, y + 10);
            }

            if (input.value) {
                ctx.fillStyle = "black";
                ctx.font = `bold ${cellSize * 0.6}px Arial`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(input.value.toUpperCase(), x + cellSize / 2, y + cellSize / 2 + 2);
            }
        }
    });


    const link = document.createElement('a');
    link.download = 'my-crossword.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
}