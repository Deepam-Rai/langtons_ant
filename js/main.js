import {
    WIDTH, HEIGHT, GRID_SIZE,
    DEF_COLOR, DEF_TIME_STEP,
    Direction,
    RULES, VISITS
} from "./constants.js"
import {
    generateColors,
    relativeDirection, getNextRelativePosition, getRandomDirection, relativeDirectionToAngle,
    ruleStringToMoves
} from "./utils.js";
import { drawGrid, drawAnt } from "./renders.js";


let configs = {
    "timeStep": DEF_TIME_STEP,
    "initialDirection": null,
    "colors": [],
    "nextMoves": [],
    "ruleLength": 0,
}

// time interval between steps
const timeStepInput = document.getElementById("timeStep");
configs.timeStep = DEF_TIME_STEP;
timeStepInput.value = configs.timeStep;
// reflect html change on javascript var
timeStepInput.addEventListener("input", function () {
    let value = parseInt(this.value);
    // Ensure the value is a positive integer
    if (isNaN(value) || value < 1) {
        this.value = DEF_TIME_STEP; 
        value = DEF_TIME_STEP;
    }
    console.log(`new timeStep:${value}`);
    configs.timeStep = value;
    updateTimeStep(value);
});

// set field canvas
const canvas = document.getElementById("antCanvas");
const ctx = canvas.getContext("2d");

canvas.width = Math.min(WIDTH, window.innerWidth - 20);
canvas.height = Math.min(HEIGHT, window.innerHeight - 20);

console.log("Canvas initialized");

// set initial direction of ant
const initialDirectionInput = document.getElementById("initialDirectionSelect");
configs.initialDirection = initialDirectionInput.value;
// make sure that when value chagnes in html it changes the javscript value
initialDirectionInput.addEventListener("change", function () {
    configs.initialDirection = this.value;
    console.log(`new initial direction:${configs.initialDirection}`);
});

// create grid and ant
let grids = {
    RULES: null,
    VISITS: null,
    "maxVisit": 0
};
let gridDraw;  // determines which grid to draw
let ant;

// set the field
let antCount = 0;
let steps = 0;
function resetField() {
    grids.cols = canvas.width / GRID_SIZE;
    grids.rows = canvas.height / GRID_SIZE;
    grids[RULES] = Array.from({ length: grids.rows}, () => Array(grids.cols).fill(0));
    grids[VISITS] = Array.from({ length: grids.rows}, () => Array(grids.cols).fill(0));
    ant = createAnt();
    steps = 0;
    document.getElementById("stepCount").textContent = steps;
}
resetField();
function createAnt() {
    let direction = configs.initialDirection === "random" ? getRandomDirection() : Direction[configs.initialDirection.toUpperCase()];
    let newAnt = {
        x: Math.floor(grids.cols / 2),
        y: Math.floor(grids.rows / 2),
        direction: direction
    };
    antCount++;
    console.log(`ant #${antCount}: ${JSON.stringify(newAnt)}`);
    return newAnt;
}

// bind gridDraw
const gridDrawInput = document.getElementById("drawGridSelect");
gridDraw = gridDrawInput.value;
gridDrawInput.addEventListener("change", function () {
    gridDraw = this.value;
    console.log(`new grid to draw:${gridDraw}`);
});

// define ant rules
configs.colors = [];
configs.nextMoves = [];
configs.ruleLength = configs.nextMoves.length;
// update based upon UI elements
const ruleSelect = document.getElementById("ruleSelect");
const customRuleInput = document.getElementById("customRuleInput");
// update rules based on selection
function updateRules(ruleString) {    
    configs.nextMoves = ruleStringToMoves(ruleString);
    // Generate colors based on rule length
    configs.colors = [DEF_COLOR, ...generateColors(configs.nextMoves.length-1)];
    configs.ruleLength = configs.nextMoves.length;
    resetField();
    console.log(`new rules: ${ruleString}`);
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
function moveAnt() {
    let currentRule = grids[RULES][ant.y][ant.x];
    ant.direction = relativeDirection(
        ant.direction,
        configs.nextMoves[currentRule]
    );
    grids[RULES][ant.y][ant.x] = (currentRule + 1) % configs.ruleLength;
    grids[VISITS][ant.y][ant.x] += 1;
    grids.maxVisit = Math.max(maxVisit, grids[VISITS][ant.y][ant.x]);
    document.getElementById("maxVisit").textContent = grids.maxVisit;
    let x_offset=0, y_offset=0;
    [x_offset, y_offset] = getNextRelativePosition(ant.direction);
    ant.x += x_offset;
    ant.y += y_offset;

    // dont go beyond edges
    ant.x = (ant.x + grids.cols) % grids.cols;
    ant.y = (ant.y + grids.rows) % grids.rows;
}


function update() {
    drawGrid(ctx, grids, gridDraw, configs.colors);
    drawAnt(ctx, ant);
    moveAnt();

    steps++;
    document.getElementById("stepCount").textContent = steps;
}


// run the simulation
let simulation = setInterval( update, configs.timeStep);

function updateTimeStep(newTimeStep) {
    clearInterval(simulation); // Stop the current loop
    simulation = setInterval(update, newTimeStep); // Restart with new interval
}
