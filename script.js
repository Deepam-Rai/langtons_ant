const WIDTH = 700;
const HEIGHT = 700;
const GRID_SIZE = 10;
const DEF_COLOR = 'white';
const DEF_TIME_STEP = 500;
const Direction = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}
const DirectionReverse = Object.fromEntries(Object.entries(Direction).map(([key, value]) => [value, key]));

// time interval between steps
const timeStepInput = document.getElementById("timeStep");
let timeStep = DEF_TIME_STEP;
timeStepInput.value = timeStep;
// reflect html change on javascript var
timeStepInput.addEventListener("input", function () {
    let value = parseInt(this.value);
    // Ensure the value is a positive integer
    if (isNaN(value) || value < 1) {
        this.value = DEF_TIME_STEP; 
        value = DEF_TIME_STEP;
    }
    console.log(`new timeStep:${value}`);
    timeStep = value;
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

// set initial direction of ant
const initialDirectionInput = document.getElementById("initialDirectionSelect");
let initialDirection = initialDirectionInput.value;
// make sure that when value chagnes in html it changes the javscript value
initialDirectionInput.addEventListener("change", function () {
    initialDirection = this.value;
    console.log(`new initial direction:${initialDirection}`);
});

// create grid and ant
let grid;
let ant;

// set the field
let antCount = 0;
let steps = 0;
function createAnt() {
    function getRandomDirection() {
        const entries = Object.values(Direction);
        return entries[Math.floor(Math.random() * entries.length)];
    }
    let direction = initialDirection === "random" ? getRandomDirection() : Direction[initialDirection.toUpperCase()];
    let newAnt = {
        x: Math.floor(cols / 2),
        y: Math.floor(rows / 2),
        direction: direction
    };
    antCount++;
    console.log(`ant #${antCount}: ${JSON.stringify(newAnt)}`);
    return newAnt;
}
function resetField() {
    grid = Array.from({ length: rows}, () => Array(cols).fill(0));
    ant = createAnt();
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
const COLORS = ["black", "blue", "green", "yellow", "purple", "orange"];
// update rules based on selection
function updateRules(ruleString) {
    function generateColors(n) {
        return Array.from({ length: n }, (_, i) => `hsl(${(i * 360 / n) % 360}, 100%, 50%)`);
    }
    let moves = [];
    for (let char of ruleString) {
        moves.push(char === 'R' ? Direction.RIGHT : Direction.LEFT);
    }
    console.log(`new rules: ${moves}`);
    // Generate colors based on rule length
    // colors = [DEF_COLOR, ...COLORS.slice(0, moves.length - 1)];
    colors = [DEF_COLOR, ...generateColors(moves.length-1)];
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
    const { x, y, direction } = ant;
    const size = GRID_SIZE; 
    const centerX = x * size + size / 2;
    const centerY = y * size + size / 2;

    ctx.fillStyle = 'black';
    ctx.beginPath();

    // Calculate triangle points based on direction
    let points = [];
    switch (direction) {
        case Direction.UP:
            points = [[-size / 3, size / 3], [size / 3, size / 3], [0, -size / 3]];
            break;
        case Direction.RIGHT:
            points = [[-size / 3, -size / 3], [-size / 3, size / 3], [size / 3, 0]];
            break;
        case Direction.DOWN:
            points = [[-size / 3, -size / 3], [size / 3, -size / 3], [0, size / 3]];
            break;
        case Direction.LEFT:
            points = [[size / 3, -size / 3], [size / 3, size / 3], [-size / 3, 0]];
            break;
    }
    // Draw the triangle
    ctx.moveTo(centerX + points[0][0], centerY + points[0][1]);
    ctx.lineTo(centerX + points[1][0], centerY + points[1][1]);
    ctx.lineTo(centerX + points[2][0], centerY + points[2][1]);
    ctx.closePath();
    ctx.fill();
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
