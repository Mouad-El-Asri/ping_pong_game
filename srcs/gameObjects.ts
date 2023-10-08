import { canvasWidth, canvasHeight } from "./drawFunctions";

import { Rect, Line, Ball } from "./interfaces";

const user_1: Rect = {
    x: 10,
    y: canvasHeight / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};

const user_2: Rect = {
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

export { user_1, user_2, midLine, ball };
