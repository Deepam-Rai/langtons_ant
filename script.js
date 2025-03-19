const WIDTH = 700;
const HEIGHT = 700;
const GRID_SIZE = 10;
const DEF_COLOR = 'white';
const DEF_TIME_STEP = 100;
const Direction = {
    UP: 0,
    UP_RIGHT: 1,
    RIGHT: 2,
    DOWN_RIGHT: 3,
    DOWN: 4,
    DOWN_LEFT: 5,
    LEFT: 6,
    UP_LEFT: 7,
    REST: -1
}
const DirectionReverse = Object.fromEntries(Object.entries(Direction).map(([key, value]) => [value, key]));
// const RelativeDirection = {
//     FRONT: 8,
//     RIGHT: 6,
//     BACK: 2,
//     LEFT: 4,
//     FRONT_LEFT: 7,
//     FRONT_RIGHT: 9,
//     BACK_RIGHT: 3,
//     BACK_LEFT: 1,
//     REST: 5
// }
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
let gridDraw;  // determines which grid to draw
let gridVisit;  // tracks visits to each cell
let maxVisit = 0;  // max number of visit to cell
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
    gridVisit = Array.from({ length: rows}, () => Array(cols).fill(0));
    ant = createAnt();
    steps = 0;
    document.getElementById("stepCount").textContent = steps;
}
resetField();

// bind gridDraw
const gridDrawInput = document.getElementById("drawGridSelect");
gridDraw = gridDrawInput.value;
gridDrawInput.addEventListener("change", function () {
    gridDraw = this.value;
    console.log(`new grid to draw:${gridDraw}`);
});

// define ant rules
let colors = [DEF_COLOR, 'black'];
let nextMoves = [Direction.RIGHT, Direction.LEFT];
let ruleLength = colors.length;
// update based upon UI elements
const ruleSelect = document.getElementById("ruleSelect");
const customRuleInput = document.getElementById("customRuleInput");
const COLORS = ["black", "blue", "green", "yellow", "purple", "orange"];
// update rules based on selection
function generateColors(n, baseHue = null) {
    return Array.from(
        { length: n },
        (_, i) => {
            let hue = baseHue !== null ? baseHue : (i * 360/n) % 360;
            let saturation = 100;
            let lightness = baseHue !== null ? (30 + (i * 50/n)) : 50;  // monotonous : lightness varies
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
    );
}
function updateRules(ruleString) {
    let moves = [];
    for (let char of ruleString) {
        switch (char) {
            case 'U':
                moves.push(Direction.UP);
                break;
            case 'X':
                moves.push(Direction.UP_RIGHT);
                break;
            case 'R':
                moves.push(Direction.RIGHT);
                break;
            case 'Y':
                moves.push(Direction.DOWN_RIGHT);
                break;
            case 'D':
                moves.push(Direction.DOWN);
                break;
            case 'Z':
                moves.push(Direction.DOWN_LEFT);
                break;
            case 'L':
                moves.push(Direction.LEFT);
                break;
            case 'W':
                moves.push(Direction.UP_LEFT);
                break;
            case 'O':
                moves.push(Direction.REST);
                break;
        }
    }
    console.log(`new rules: ${ruleString}`);
    // Generate colors based on rule length
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
    let ruleString = this.value.toUpperCase().replace(/[^RLWXYZO]/g, ""); // Allow only R and L
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
    if (next === Direction.REST) {
        return Direction.REST;
    }
    let directions = [
        Direction.UP, Direction.UP_RIGHT, Direction.RIGHT, Direction.DOWN_RIGHT,
        Direction.DOWN, Direction.DOWN_LEFT, Direction.LEFT, Direction.UP_LEFT
    ];
    switch (next) {
        case Direction.UP:
            offset = 0;
            break;
        case Direction.UP_RIGHT:
            offset = +1;
            break;
        case Direction.RIGHT:
            offset = +2;
            break;
        case Direction.DOWN_RIGHT:
            offset = +3;
            break;
        case Direction.DOWN:
            offset = +4;
            break;
        case Direction.DOWN_LEFT:
            offset = +5;
            break;
        case Direction.LEFT:
            offset = +6;
            break;
        case Direction.UP_LEFT:
            offset = +7;
            break;
    }
    return directions[(current + offset) % directions.length];
}

function moveAnt() {
    let currentRule = grid[ant.y][ant.x];
    ant.direction = relativeDirection(
        ant.direction,
        nextMoves[currentRule]
    );
    grid[ant.y][ant.x] = (currentRule + 1) % ruleLength;
    gridVisit[ant.y][ant.x] += 1;
    maxVisit = Math.max(maxVisit, gridVisit[ant.y][ant.x]);
    document.getElementById("maxVisit").textContent = maxVisit;
    switch (ant.direction) {
        case Direction.UP:
            ant.y -= 1;
            break;
        case Direction.RIGHT:
            ant.x += 1;
            break;
        case Direction.DOWN:
            ant.y += 1;
            break;
        case Direction.LEFT:
            ant.x -= 1;
            break;
        case Direction.UP_LEFT:
            ant.x -= 1;
            ant.y -= 1;
            break;
        case Direction.UP_RIGHT:
            ant.x += 1;
            ant.y -= 1;
            break;
        case Direction.DOWN_RIGHT:
            ant.x += 1;
            ant.y += 1;
            break;
        case Direction.DOWN_LEFT:
            ant.x -= 1;
            ant.y += 1;
            break;
        case Direction.REST:
            break;
    }

    // dont go beyond edges
    ant.x = (ant.x + cols) % cols;
    ant.y = (ant.y + rows) % rows;
}

function drawGrid() {
    visitColors = [DEF_COLOR, ...generateColors(Math.max(maxVisit-1, 10), 0).reverse()];
    for (let y = 0; y < rows; y++) {
        for(let x = 0; x< cols; x++) {
            if ( gridDraw === "grid") {
                ctx.fillStyle = colors[grid[y][x]];
            } else if ( gridDraw === "visit") {
                ctx.fillStyle = visitColors[gridVisit[y][x]];
            }
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

    if (direction === Direction.REST) {
        // Draw a circle for REST mode
        ctx.arc(centerX, centerY, size / 3, 0, 2 * Math.PI);
    } else {
        function rotatePoint(x, y, angle) {
            let radians = angle * Math.PI / 180;
            let cosA = Math.cos(radians);
            let sinA = Math.sin(radians);
            return [
                x * cosA - y * sinA, // Rotated X
                x * sinA + y * cosA  // Rotated Y
            ];
        }
        let transformAngle = 0;  // in degrees
        switch (direction) {
            case Direction.UP:
                transformAngle = 0;
                break;
            case Direction.RIGHT:
                transformAngle = 90;
                break;
            case Direction.DOWN:
                transformAngle = 180;
                break;
            case Direction.LEFT:
                transformAngle = -90;
                break;
            case Direction.UP_LEFT:
                transformAngle = -45;
                break;
            case Direction.UP_RIGHT:
                transformAngle = 45;
                break;
            case Direction.DOWN_RIGHT:
                transformAngle = 135;
                break;
            case Direction.DOWN_LEFT:
                transformAngle = -135;
                break;
        }
        let points = [[-size / 3, size / 3], [0, size / 6], [size / 3, size / 3], [0, -size / 2]];
        points = points.map(point => rotatePoint(point[0], point[1], transformAngle));
        // Draw a triangle for movement
        ctx.moveTo(centerX + points[0][0], centerY + points[0][1]);
        for (let i=1; i<points.length; i++) {
            ctx.lineTo(centerX + points[i][0], centerY + points[i][1]);
        }
        ctx.closePath();
    }
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
