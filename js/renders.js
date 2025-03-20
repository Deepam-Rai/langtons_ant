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
