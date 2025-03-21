// binds html dashboard values to javascript variables

import { DEF_TIME_STEP, DEF_ANT_COUNT } from "./constants.js";
import { updateSimulation, updateRules } from "./main.js";

// bind time interval between steps
export function bindTimeStep(configs, metas){
    const timeStepInput = document.getElementById("timeStep");
    configs.timeStep = DEF_TIME_STEP;
    timeStepInput.value = configs.timeStep;
    timeStepInput.addEventListener("change", function () {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = DEF_TIME_STEP; 
            value = DEF_TIME_STEP;
        }
        console.log(`new timeStep:${value}`);
        configs.timeStep = value;
        clearInterval(metas.simulation); // Stop the current loop
        metas.simulation = setInterval(updateSimulation, configs.timeStep); // Restart with new interval
    });
}

export function bindAntCount(configs){
    const input = document.getElementById("antCount");
    configs.antCount = DEF_ANT_COUNT;
    input.value = configs.antCount;
    input.addEventListener("change", function () {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 0) {
            this.value = DEF_ANT_COUNT; 
            value = DEF_ANT_COUNT;
        }
        console.log(`new antCount:${value}`);
        configs.antCount = value;
    });
}

export function bindInitialDirection(configs) {
    const initialDirectionInput = document.getElementById("initialDirectionSelect");
    configs.initialDirection = initialDirectionInput.value;
    initialDirectionInput.addEventListener("change", function () {
        configs.initialDirection = this.value;
        console.log(`new initial direction:${configs.initialDirection}`);
    });
}

export function bindSpawnLocation(configs) {
    const input = document.getElementById("spawnLocation");
    configs.spawnLocation = input.value;
    input.addEventListener("change", function () {
        configs.spawnLocation = this.value;
        console.log(`new spawn location:${configs.spawnLocation}`);
    });
}



export function bindGridDraw(configs) {
    const gridDrawInput = document.getElementById("drawGridSelect");
    configs.gridDraw = gridDrawInput.value;
    gridDrawInput.addEventListener("change", function () {
        configs.gridDraw = this.value;
        console.log(`new grid to draw:${configs.gridDraw}`);
    });
}

export function bindDropdownRules() {
    const ruleSelect = document.getElementById("ruleSelect");
    ruleSelect.addEventListener("change", function () {
        updateRules(this.value);
    });
}

export function bindCustomRules(){
    const customRuleInput = document.getElementById("customRuleInput");
    customRuleInput.addEventListener("input", function () {
        let ruleString = this.value.toUpperCase().replace(/[^RLWXYZO]/g, ""); // Allow only R and L
        if (ruleString.length > 0) {
            updateRules(ruleString);
        }
    });
}