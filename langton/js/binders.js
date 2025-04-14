// binds html dashboard values to javascript variables

import { DEF_TIME_STEP, DEF_ANT_COUNT, PLAY, PAUSE, DEF_ROWS, DEF_COLS, DEF_GRID_SIZE } from "./constants.js";
import { updateSimulation, updateRules, draw } from "./main.js";
import { resetField, resetCanvas } from "./main.js";

export function bindRestart(configs, metas){
    const input = document.getElementById("restart");
    input.addEventListener("click", function () {
        clearInterval(metas.simulation); // Stop the current loop
        resetField();
        metas.simulation = setInterval(updateSimulation, configs.timeStep); // Restart loop
        console.log(`restarted simulation.`);
    });
}

export function bindPausePlay(configs, metas){
    const input = document.getElementById("pausePlay");
    input.innerText = configs.state === PAUSE ? "▶" : "❚❚";
    input.addEventListener("click", function () {
        configs.state = configs.state === PLAY ? PAUSE : PLAY;
        input.innerText = configs.state === PAUSE ? "▶" : "❚❚";
        if (configs.state === PAUSE) {
            clearInterval(metas.simulation); // Stop the current loop
        } else if(configs.state === PLAY) {
            metas.simulation = setInterval(updateSimulation, configs.timeStep); // Restart loop
        }
        console.log(`new pausePlay state:${configs.state}`);
    });
}


export function bindRows(configs){
    const input = document.getElementById("rows");
    configs.rows = DEF_ROWS;
    input.value = configs.rows;
    input.addEventListener("change", function () {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = DEF_ROWS; 
            value = DEF_ROWS;
        }
        console.log(`new rows count:${value}`);
        configs.rows = value;
    });
}

export function bindCols(configs){
    const input = document.getElementById("cols");
    configs.cols = DEF_COLS;
    input.value = configs.cols;
    input.addEventListener("change", function () {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = DEF_COLS; 
            value = DEF_COLS;
        }
        console.log(`new cols count:${value}`);
        configs.cols = value;
    });
}

export function bindGridSize(configs){
    const input = document.getElementById("gridSize");
    configs.gridSize = DEF_GRID_SIZE;
    input.value = configs.gridSize;
    input.addEventListener("change", function () {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = DEF_GRID_SIZE; 
            value = DEF_GRID_SIZE;
        }
        console.log(`new grid size:${value}`);
        configs.gridSize = value;
        resetCanvas();
    });
}

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
        draw();
        console.log(`new grid to draw:${configs.gridDraw}`);
    });
}

export function bindDropdownRules() {
    const ruleSelect = document.getElementById("ruleSelect");
    ruleSelect.addEventListener("change", function () {
        document.getElementById("customRuleInput").value = "";
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