import {
    WIDTH, HEIGHT, DEF_COLOR, DEF_TIME_STEP,
} from "./constants.js";
import {
    generateColors, ruleStringToMoves
} from "./utils.js";
import { Ant } from "./ant.js";
import { Grids } from "./grids.js";
import {
    bindTimeStep, bindInitialDirection, bindGridDraw, bindDropdownRules, bindCustomRules
} from "./binders.js";


let metas = {
    "canvas": document.getElementById("antCanvas"),
    "simulation": null,
    "steps": 0,
    "ant": null,
    "grids": null,
    "configs": {
        "timeStep": DEF_TIME_STEP,
        "initialDirection": null,
        "colors": [],
        "nextMoves": [],
        "ruleLength": 0,
    }
};
metas.ctx = metas.canvas.getContext("2d");
metas.canvas.width = Math.min(WIDTH, window.innerWidth - 20);
metas.canvas.height = Math.min(HEIGHT, window.innerHeight - 20);


metas.grids = new Grids(metas.canvas, metas.configs);


export function resetField() {
    metas.grids.reset();
    metas.ant = new Ant(metas.ctx, metas.grids, metas.configs);
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


// bind dashboard inputs with javascript variables
bindTimeStep(metas.configs, metas);
bindInitialDirection(metas.configs)
bindGridDraw(metas.configs)
bindDropdownRules();
bindCustomRules();


// Initialize with default rule
updateRules(ruleSelect.value);


export function updateSimulation() {
    metas.grids.draw();
    metas.ant.draw();
    metas.ant.move();

    metas.steps++;
    document.getElementById("stepCount").textContent = metas.steps;
}


// start the simulation
metas.simulation = setInterval( updateSimulation, metas.configs.timeStep);

