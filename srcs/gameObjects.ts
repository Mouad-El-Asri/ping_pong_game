import { canvasWidth, canvasHeight } from "./drawFunctions";

import { Player, Line, Ball } from "./interfaces";

const player_1: Player = {
    x: 10,
    y: canvasHeight / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};

const player_2: Player = {
    x: canvasWidth - 20,
    y: canvasHeight / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};

const midLine: Line = {
    startX: canvasWidth / 2,
    startY: 0,
    endX: canvasWidth / 2,
    endY: canvasHeight,
    color: "#6c757d",
};

const ball: Ball = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    r: 10,
    speed: 7,
    velocityX: 7,
    velocityY: 7,
    color: "#1E1B37",
};

export { player_1, player_2, midLine, ball };
