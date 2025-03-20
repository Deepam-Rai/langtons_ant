import { DEF_COLOR, GRID_SIZE, Direction, VISITS, RULES } from "./constants.js";
import { generateColors, relativeDirectionToAngle } from "./utils.js";


export function drawGrid(ctx, grids, gridDraw, colors) {
    let visitColors = [DEF_COLOR, ...generateColors(Math.max(grids.maxVisit-1, 10), 0).reverse()];
    for (let y = 0; y < grids.rows; y++) {
        for(let x = 0; x< grids.cols; x++) {
            if ( gridDraw === RULES) {
                ctx.fillStyle = colors[grids[RULES][y][x]];
            } else if ( gridDraw === VISITS) {
                ctx.fillStyle = visitColors[grids[VISITS][y][x]];
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


export function drawAnt(ctx, ant ) {
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
        let transformAngle = relativeDirectionToAngle(direction);  // in degrees
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