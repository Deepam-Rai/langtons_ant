import { Direction, DEF_RULES } from "./constants.js";
import { Ant } from "./ant.js";

export function generateColors(n, baseHue = null) {
    return Array.from(
        { length: n },
        (_, i) => {
            let hue = baseHue !== null ? baseHue : (i * 360/n) % 360;
            let saturation = 100;
            let lightness = baseHue !== null ? (30 + (i * 50/n)) : 50;  // monotonous -> lightness varies
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
    );
}


export function relativeDirection(current, next) {
    /**
     * current: current direction; e.g. UP, DOWN, etc
     * next: relative direction to the current direction; e.g. LEFT/RIGHT to current direction
     */
    if (next === Direction.REST) {
        return Direction.REST;
    }
    let directions = [
        Direction.UP, Direction.UP_RIGHT, Direction.RIGHT, Direction.DOWN_RIGHT,
        Direction.DOWN, Direction.DOWN_LEFT, Direction.LEFT, Direction.UP_LEFT
    ];
    let offset = null;
    switch (next) {
        case Direction.UP:
            offset = 0;
            break;
        case Direction.UP_RIGHT:
            offset = +1;
            break;
        case Direction.RIGHT:
            offset = +2;
            break;
        case Direction.DOWN_RIGHT:
            offset = +3;
            break;
        case Direction.DOWN:
            offset = +4;
            break;
        case Direction.DOWN_LEFT:
            offset = +5;
            break;
        case Direction.LEFT:
            offset = +6;
            break;
        case Direction.UP_LEFT:
            offset = +7;
            break;
    }
    return directions[(current + offset) % directions.length];
}


export function getRandomDirection() {
    const entries = Object.values(Direction);
    return entries[Math.floor(Math.random() * entries.length)];
}


export function ruleStringToMoves(ruleString) {
    let moves = [];
    for (let char of ruleString) {
        switch (char) {
            case 'U':
                moves.push(Direction.UP);
                break;
            case 'X':
                moves.push(Direction.UP_RIGHT);
                break;
            case 'R':
                moves.push(Direction.RIGHT);
                break;
            case 'Y':
                moves.push(Direction.DOWN_RIGHT);
                break;
            case 'D':
                moves.push(Direction.DOWN);
                break;
            case 'Z':
                moves.push(Direction.DOWN_LEFT);
                break;
            case 'L':
                moves.push(Direction.LEFT);
                break;
            case 'W':
                moves.push(Direction.UP_LEFT);
                break;
            case 'O':
                moves.push(Direction.REST);
                break;
        }
    }
    return moves;
}


export function getNextRelativePosition(direction) {
    let x_offset=0, y_offset=0;
    switch (direction) {
        case Direction.UP:
            y_offset -= 1;
            break;
        case Direction.RIGHT:
            x_offset += 1;
            break;
        case Direction.DOWN:
            y_offset += 1;
            break;
        case Direction.LEFT:
            x_offset -= 1;
            break;
        case Direction.UP_LEFT:
            x_offset -= 1;
            y_offset -= 1;
            break;
        case Direction.UP_RIGHT:
            x_offset += 1;
            y_offset -= 1;
            break;
        case Direction.DOWN_RIGHT:
            x_offset += 1;
            y_offset += 1;
            break;
        case Direction.DOWN_LEFT:
            x_offset -= 1;
            y_offset += 1;
            break;
        case Direction.REST:
            break;
    }
    return [x_offset, y_offset];
}

export function relativeDirectionToAngle(direction) {
    let angle = null;
    switch (direction) {
        case Direction.UP:
            angle = 0;
            break;
        case Direction.RIGHT:
            angle = 90;
            break;
        case Direction.DOWN:
            angle = 180;
            break;
        case Direction.LEFT:
            angle = -90;
            break;
        case Direction.UP_LEFT:
            angle = -45;
            break;
        case Direction.UP_RIGHT:
            angle = 45;
            break;
        case Direction.DOWN_RIGHT:
            angle = 135;
            break;
        case Direction.DOWN_LEFT:
            angle = -135;
            break;
    }
    return angle;
}

export function populateRuleDropdown(domId) {
    const ruleSelect = document.getElementById(domId);
    ruleSelect.innerHTML = "";  // clear existing
    DEF_RULES.forEach(rule => {
        const option = document.createElement("option");
        option.value = rule.value;
        option.textContent = rule.label;
        ruleSelect.appendChild(option);
    });
}