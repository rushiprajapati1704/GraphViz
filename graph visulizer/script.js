const grid = document.getElementById('grid');
let rows = 20;
let cols = 20;
let sourceCell = null;
let destinationCell = null;
let speed = document.getElementById('speed').value;
function speedChange(){
    speed=document.getElementById("speed").value;
    console.log(speed);
}
// Initialize the grid
generateGrid();

function generateGrid() {
    grid.innerHTML = '';
    rows = document.getElementById('rows').value;
    cols = document.getElementById('cols').value;
    grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => selectCell(cell, i));
        grid.appendChild(cell);
    }

    // Reset source and destination cells
    sourceCell = null;
    destinationCell = null;
}

function selectCell(cell, index) {
    const row = Math.floor(index / cols);
    const col = index % cols;

    if (!sourceCell) {
        cell.classList.add('source');
        
        let label = document.createElement('p');
        label.innerText = 'S';
        label.style.margin = 0;
        label.style.color = 'white';
        cell.appendChild(label);
        
        sourceCell = { element: cell, row, col };
    } else if (!destinationCell) {
        cell.classList.add('destination');
        
        let label = document.createElement('p');
        label.innerText = 'D';
        label.style.margin = 0;
        label.style.color = 'white';
        cell.appendChild(label);
        
        destinationCell = { element: cell, row, col };
    }
}

function startBFS() {
    if (!sourceCell || !destinationCell) {
        alert('Please select both source and destination cells');
        return;
    }
    speed = document.getElementById('speed').value;
    bfs(sourceCell.row, sourceCell.col);
}

async function bfs(startRow, startCol) {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    let step=0;
    const queue = [[startRow, startCol,step]];
    const visited = new Set();
    visited.add(`${startRow}-${startCol}`);
    while (queue.length > 0) {
        const [row, col,stp] = queue.shift();
        const cellIndex = row * cols + col;
        const cell = grid.children[cellIndex];
        const pp=document.createElement('p'); pp.innerText=stp; cell.appendChild(pp); document.getElementById("step").innerHTML=`STEPS : ${stp}`;
        if((sourceCell.row!=row || sourceCell.col!=col) && (destinationCell.row!=row || destinationCell.col!=col))
            cell.classList.add('visited');
        await new Promise(r => setTimeout(r, speed));

        if (row === destinationCell.row && col === destinationCell.col) {
            alert(`Steps :- ${stp}  `);
            return;
        }

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            const newIndex = newRow * cols + newCol;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited.has(`${newRow}-${newCol}`)) {
                queue.push([newRow, newCol,stp+1]);
                visited.add(`${newRow}-${newCol}`);
            }
        }
    }

    alert('Destination not found');
}

function startDFS() {
    if (!sourceCell || !destinationCell) {
        alert('Please select both source and destination cells');
        return;
    }
    speed = document.getElementById('speed').value;
    const visited = new Set();
    let step=1;
    dfs(sourceCell.row, sourceCell.col, visited,step);
}

async function dfs(row, col, visited,step) {
    const cellIndex = row * cols + col;
    const cell = grid.children[cellIndex];
    const stp = document.createElement('p');
    stp.innerText=step;
    document.getElementById("step").innerHTML=`STEPS : ${step}`
    step++;
    cell.appendChild(stp);
    if((sourceCell.row!=row || sourceCell.col!=col) && (destinationCell.row!=row || destinationCell.col!=col))
    cell.classList.add('visited');
    await new Promise(r => setTimeout(r, speed));

    if (row === destinationCell.row && col === destinationCell.col) {
        return true;
    }

    visited.add(`${row}-${col}`);

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited.has(`${newRow}-${newCol}`)) {
            if(await dfs(newRow, newCol, visited,step))
                return true;
        }
    }
}