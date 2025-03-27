import { RULES, DEF_COLOR, VISITS } from "./constants.js";
import { generateColors } from "./utils.js";


export class Grids {
    constructor(canvas, configs){
        this.canvas = canvas;
        this.configs = configs;
        // grids
        this.rules = null;
        this.visits = null;
        // values
        this.maxVisit = 0;
        this.reset();
    }
    reset() {
        this.cols = this.configs.cols;
        this.rows = this.configs.rows;
        this.rules = Array.from({ length: this.rows}, () => Array(this.cols).fill(0));
        this.visits = Array.from({ length: this.rows}, () => Array(this.cols).fill(0));
    }
    draw() {
        let ctx = this.canvas.getContext("2d");
        let visitColors = [DEF_COLOR, ...generateColors(Math.max(this.maxVisit-1, 10), 0).reverse()];
        for (let y = 0; y < this.rows; y++) {
            for(let x = 0; x< this.cols; x++) {
                if ( this.configs.gridDraw === RULES) {
                    ctx.fillStyle = this.configs.colors[this.rules[y][x]];
                } else if ( this.configs.gridDraw === VISITS) {
                    ctx.fillStyle = visitColors[this.visits[y][x]];
                }
                let posX = Math.floor(x * this.configs.gridSize);
                let posY = Math.floor(y * this.configs.gridSize);
                let size = Math.floor(this.configs.gridSize);
                ctx.fillRect(posX, posY, size, size);
                ctx.strokeStyle = 'gray';
                ctx.strokeRect(posX, posY, size, size);
            }
        }
    }
}