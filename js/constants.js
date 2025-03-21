export const WIDTH = 700;
export const HEIGHT = 700;
export const GRID_SIZE = 10;
export const DEF_COLOR = 'white';
export const DEF_TIME_STEP = 100;
export const DEF_ANT_COUNT = 1;
export const Direction = {
    UP: 0,
    UP_RIGHT: 1,
    RIGHT: 2,
    DOWN_RIGHT: 3,
    DOWN: 4,
    DOWN_LEFT: 5,
    LEFT: 6,
    UP_LEFT: 7,
    REST: -1
}
export const DirectionReverse = Object.fromEntries(Object.entries(Direction).map(([key, value]) => [value, key]));
// const RelativeDirection = {
//     FRONT: 8,
//     RIGHT: 6,
//     BACK: 2,
//     LEFT: 4,
//     FRONT_LEFT: 7,
//     FRONT_RIGHT: 9,
//     BACK_RIGHT: 3,
//     BACK_LEFT: 1,
//     REST: 5
// }

// grid types & its constants
export const RULES = "rules";  // usual grids
export const VISITS = "visits";  // shows visits heatmap
