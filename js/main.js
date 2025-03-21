import {
    WIDTH, HEIGHT, DEF_COLOR, DEF_TIME_STEP,
} from "./constants.js";
import {
    generateColors, ruleStringToMoves, populateRuleDropdown
} from "./utils.js";
import { Ants } from "./ant.js";
import { Grids } from "./grids.js";
import {
    bindTimeStep, bindInitialDirection, bindSpawnLocation, bindGridDraw, bindDropdownRules, bindCustomRules,
    bindAntCount,
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
        "initialDirection": null,
        "spawnLocation": "random",
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
bindTimeStep(metas.configs, metas);
bindInitialDirection(metas.configs);
bindSpawnLocation(metas.configs);
bindAntCount(metas.configs);
bindGridDraw(metas.configs);
bindDropdownRules();
bindCustomRules();


// Initialize with default rule
updateRules(ruleSelect.value);


export function updateSimulation() {
    metas.grids.draw();
    metas.ants.draw();
    metas.ants.move();

    metas.steps++;
    document.getElementById("stepCount").textContent = metas.steps;
}


// start the simulation
metas.simulation = setInterval( updateSimulation, metas.configs.timeStep);

