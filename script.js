const WIDTH = 700;
const HEIGHT = 700;
const GRID_SIZE = 10;
const DEF_COLOR = 'white';
const DEF_TIME_STEP = 100;
const Direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}
const DirectionReverse = Object.fromEntries(Object.entries(Direction).map(([key, value]) => [value, key]));

// time interval between steps
const timeStep = document.getElementById("timeStep");
timeStep.addEventListener("input", function () {
    let value = parseInt(this.value, DEF_TIME_STEP);
    // Ensure the value is a positive integer
    if (isNaN(value) || value < 1) {
        this.value = DEF_TIME_STEP; 
        value = DEF_TIME_STEP;
    }
    updateTimeStep(value);
});

// set field canvas
const canvas = document.getElementById("antCanvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(WIDTH, window.innerWidth - 20);
canvas.height = Math.min(HEIGHT, window.innerHeight - 20);

console.log("Canvas initialized");

const cols = canvas.width / GRID_SIZE;
const rows = canvas.height / GRID_SIZE;

// create grid and ant
let grid;
let ant;

// set the field
let steps = 0;
function resetField() {
    grid = Array.from({ length: rows}, () => Array(cols).fill(0));
    ant = {
        x: Math.floor(cols / 2),
        y: Math.floor(rows / 2),
        direction: Direction.LEFT
    };
    steps = 0;
    document.getElementById("stepCount").textContent = steps;
}
resetField();


// define ant rules
let colors = [DEF_COLOR, 'black'];
let nextMoves = [Direction.RIGHT, Direction.LEFT];
let ruleLength = colors.length;
// update based upon UI elements
const ruleSelect = document.getElementById("ruleSelect");
const customRuleInput = document.getElementById("customRuleInput");
const COLORS = ["black", "red", "blue", "green", "yellow", "purple", "orange"];
// update rules based on selection
function updateRules(ruleString) {
    let moves = [];
    for (let char of ruleString) {
        moves.push(char === 'R' ? Direction.RIGHT : Direction.LEFT);
    }
    // Generate colors based on rule length
    colors = [DEF_COLOR, ...COLORS.slice(0, moves.length - 1)];
    // Update global rule variables
    nextMoves = moves;
    ruleLength = moves.length;
    // reset field
    resetField();
}

// Handle rules dropdown change
ruleSelect.addEventListener("change", function () {
    if (this.value === "custom") {
        customRuleInput.disabled = false;
        customRuleInput.value = ""; // Clear input
    } else {
        customRuleInput.disabled = true;
        updateRules(this.value);
    }
});

// Handle custom rule input
customRuleInput.addEventListener("input", function () {
    let ruleString = this.value.toUpperCase().replace(/[^RL]/g, ""); // Allow only R and L
    if (ruleString.length > 0) {
        updateRules(ruleString);
    }
});

// Initialize with default rule
updateRules(ruleSelect.value);

// ant's behaviour
function relativeDirection(current, next) {
    /**
     * current: current direction; e.g. UP, DOWN, etc
     * next: relative direction to the current direction; e.g. LEFT/RIGHT to current direction
     */
    let directions = [Direction.LEFT, Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT, Direction.UP];
    let offset = next == Direction.LEFT ? -1 : 1;
    return directions[(current + 1) + offset];
}

function moveAnt() {
    let currentRule = grid[ant.y][ant.x];
    ant.direction = relativeDirection(
        ant.direction,
        nextMoves[currentRule]
    );
    grid[ant.y][ant.x] = (currentRule + 1) % ruleLength;
    if (ant.direction == Direction.UP) ant.y -= 1;
    if (ant.direction == Direction.RIGHT) ant.x += 1;
    if (ant.direction == Direction.DOWN) ant.y += 1;
    if (ant.direction == Direction.LEFT) ant.x -= 1;

    // dont go beyond edges
    ant.x = (ant.x + cols) % cols;
    ant.y = (ant.y + rows) % rows;
}

function drawGrid() {
    for (let y = 0; y < rows; y++) {
        for(let x = 0; x< cols; x++) {
            ctx.fillStyle = colors[grid[y][x]];
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

function update() {
    moveAnt();
    drawGrid();
    drawAnt();

    steps++;
    document.getElementById("stepCount").textContent = steps;
}


// set the dashboard values
// run the simulation
drawGrid();
drawAnt();
simulation = setInterval( update, timeStep);

function updateTimeStep(newTimeStep) {
    clearInterval(simulation); // Stop the current loop
    simulation = setInterval(update, newTimeStep); // Restart with new interval
}
