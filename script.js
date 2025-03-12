const WIDTH = 700;
const HEIGHT = 700;
const GRID_SIZE = 10;

const canvas = document.getElementById("antCanvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(WIDTH, window.innerWidth - 20);
canvas.height = Math.min(HEIGHT, window.innerHeight - 20);

console.log("Canvas initialized");

const cols = canvas.width / GRID_SIZE;
const rows = canvas.height / GRID_SIZE;

// create grid; 0=white, 1=black
let grid = Array.from({ length: rows}, () => Array(cols).fill(0));

// define ant
let ant = {
    x: Math.floor(cols / 2),
    y: Math.floor(rows / 2),
    direction: 0  // 0=up, 1=right, 2=down, 3=left
}

// ant's behaviour
function moveAnt() {
    // if on white cell => turn right; flip the color; move forward
    // if on black cell => turn left; flip the color; move forward
    let currentColor = grid[ant.y][ant.x];
    ant.direction = currentColor == 0 ? (ant.direction + 1) % 4 : (ant.direction + 3) % 4;
    grid[ant.y][ant.x] = currentColor == 0 ? 1 : 0;
    if (ant.direction == 0) ant.y -= 1;
    if (ant.direction == 1) ant.x += 1;
    if (ant.direction == 2) ant.y += 1;
    if (ant.direction == 3) ant.x -= 1;

    // dont go beyond edges
    ant.x = (ant.x + cols) % cols;
    ant.y = (ant.y + rows) % rows;
}

function drawGrid() {
    for (let y = 0; y < rows; y++) {
        for(let x = 0; x< cols; x++) {
            ctx.fillStyle = grid[y][x] == 0 ? 'white' : 'black';
            let posX = Math.floor(x * GRID_SIZE);
            let posY = Math.floor(y * GRID_SIZE);
            let size = Math.floor(GRID_SIZE);
            ctx.fillRect(posX, posY, size, size);
            ctx.strokeStyle = 'gray';
            ctx.strokeRect(posX, posY, size, size);
        }
    }
}

function drawAnt() {
    ctx.fillStyle = 'red';
    ctx.fillRect(ant.x * GRID_SIZE, ant.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

let steps = 0;
function update() {
    moveAnt();
    drawGrid();
    drawAnt();

    steps++;
    document.getElementById("stepCount").textContent = steps;
}

// run the simulation
setInterval( update, 5);
