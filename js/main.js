import {
    DEF_ROWS, DEF_COLS, DEF_COLOR, DEF_TIME_STEP, PLAY,
    DEF_GRID_SIZE
} from "./constants.js";
import {
    generateColors, ruleStringToMoves, populateRuleDropdown
} from "./utils.js";
import { Ants } from "./ant.js";
import { Grids } from "./grids.js";
import {
    bindTimeStep, bindInitialDirection, bindSpawnLocation, bindGridDraw, bindDropdownRules, bindCustomRules,
    bindAntCount, bindPausePlay, bindRestart, bindRows, bindCols, bindGridSize
} from "./binders.js";


let metas = {
    "canvas": document.getElementById("antCanvas"),
    "simulation": null,
    "steps": 0,
    "antCount": 1,
    "ants": [],
    "grids": null,
    "configs": {
        "timeStep": DEF_TIME_STEP,
        "state": PLAY,
        "initialDirection": null,
        "spawnLocation": "random",
        "colors": [],
        "nextMoves": [],
        "ruleLength": 0,
        "gridSize": DEF_GRID_SIZE,
        "rows": DEF_ROWS,
        "cols": DEF_COLS,
    }
};

export function resetCanvas() {
    metas.ctx = metas.canvas.getContext("2d");
    metas.canvas.height = metas.configs.gridSize * metas.configs.rows;
    metas.canvas.width = metas.configs.gridSize * metas.configs.cols;
    const container = document.getElementById("canvas-container");
    container.style.alignItems = container.scrollHeight > container.offsetHeight ? "flex-start" : "center";
    container.style.justifyContent = container.scrollWidth > container.offsetWidth ? "flex-start" : "center";
}
export function resetField() {
    resetCanvas();
    metas.grids = new Grids(metas.canvas, metas.configs);
    metas.ants = new Ants(metas.configs.antCount, metas.ctx, metas.grids, metas.configs);
    metas.steps = 0;
    document.getElementById("stepCount").textContent = metas.steps;
}


export function updateRules(ruleString) {    
    metas.configs.nextMoves = ruleStringToMoves(ruleString);
    // Generate colors based on rule length
    metas.configs.colors = [DEF_COLOR, ...generateColors(metas.configs.nextMoves.length-1)];
    metas.configs.ruleLength = metas.configs.nextMoves.length;
    resetField();
    console.log(`new rules: ${ruleString}`);
}



// prepopulate default values
populateRuleDropdown("ruleSelect");
// bind dashboard inputs with javascript variables
bindRestart(metas.configs, metas);
bindPausePlay(metas.configs, metas);
bindRows(metas.configs);
bindCols(metas.configs);
bindGridSize(metas.configs);
bindTimeStep(metas.configs, metas);
bindInitialDirection(metas.configs);
bindSpawnLocation(metas.configs);
bindAntCount(metas.configs);
bindGridDraw(metas.configs);
bindDropdownRules();
bindCustomRules();


// Initialize with default rule
updateRules(ruleSelect.value);  // updates default rules and (re)sets everything.


export function draw() {
    metas.grids.draw();
    metas.ants.draw();
}
export function updateSimulation() {
    draw();
    metas.ants.move();

    metas.steps++;
    document.getElementById("stepCount").textContent = metas.steps;
}


// start the simulation
metas.simulation = setInterval( updateSimulation, metas.configs.timeStep);

