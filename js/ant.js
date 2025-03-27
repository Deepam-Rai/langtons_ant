import { RULES, VISITS, Direction } from "./constants.js";
import { relativeDirection, getNextRelativePosition, relativeDirectionToAngle, getRandomDirection } from "./utils.js";


export class Ant {
    constructor(ctx, grids, configs) {
        this.ctx = ctx;    // context for drawing
        this.grids = grids;  // grid upon which ant is simulated
        this.configs = configs;
        this.create();
    }
    create() {
        if (this.configs.spawnLocation === "center") {
            this.x = Math.floor(this.grids.cols / 2);
            this.y = Math.floor(this.grids.rows / 2);
        } else if (this.configs.spawnLocation === "random") {
            this.x = Math.floor(Math.random() * this.grids.cols);
            this.y = Math.floor(Math.random() * this.grids.rows);
        }
        this.direction = this.configs.initialDirection === "random" ? getRandomDirection() : Direction[this.configs.initialDirection.toUpperCase()];
    }
    move() {
        let currentRule = this.grids[RULES][this.y][this.x];
        this.direction = relativeDirection(
            this.direction,
            this.configs.nextMoves[currentRule]
        );
        this.grids[RULES][this.y][this.x] = (currentRule + 1) % this.configs.ruleLength;
        this.grids[VISITS][this.y][this.x] += 1;
        this.grids.maxVisit = Math.max(this.grids.maxVisit, this.grids[VISITS][this.y][this.x]);
        document.getElementById("maxVisit").textContent = this.grids.maxVisit;
        let x_offset=0, y_offset=0;
        [x_offset, y_offset] = getNextRelativePosition(this.direction);
        this.x += x_offset;
        this.y += y_offset;
    
        // dont go beyond edges
        this.x = (this.x + this.grids.cols) % this.grids.cols;
        this.y = (this.y + this.grids.rows) % this.grids.rows;
    }
    draw() {
        const size = this.configs.gridSize; 
        const centerX = this.x * size + size / 2;
        const centerY = this.y * size + size / 2;
    
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
    
        if (this.direction === Direction.REST) {
            // Draw a circle for REST mode
            this.ctx.arc(centerX, centerY, size / 3, 0, 2 * Math.PI);
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
            let transformAngle = relativeDirectionToAngle(this.direction);  // in degrees
            let points = [[-size / 3, size / 3], [0, size / 6], [size / 3, size / 3], [0, -size / 2]];
            points = points.map(point => rotatePoint(point[0], point[1], transformAngle));
            // Draw a triangle for movement
            this.ctx.moveTo(centerX + points[0][0], centerY + points[0][1]);
            points.slice(1).forEach(point => {
                this.ctx.lineTo(centerX + point[0], centerY + point[1]);
            });
            this.ctx.closePath();
        }
        this.ctx.fill();
    }
}


export class Ants {
    constructor(n, ctx, grids, configs) {
        this.ants = Array.from({length: n}, (_, i) => new Ant(ctx, grids, configs));
    }
    draw() {
        this.ants.forEach(ant => {
            ant.draw();
        });
    }
    move() {
        this.ants.forEach(ant => {
            ant.move();
        });
    }
}
