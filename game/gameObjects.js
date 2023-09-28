"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ball = exports.midLine = exports.comp = exports.user = void 0;
const drawFunctions_js_1 = require("./drawFunctions.js");
const user = {
    x: 10,
    y: drawFunctions_js_1.canvasHeight / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};
exports.user = user;
const comp = {
    x: drawFunctions_js_1.canvasWidth - 20,
    y: drawFunctions_js_1.canvasHeight / 2 - 100 / 2,
    w: 6,
    h: 100,
    color: "#211F3C",
    score: 0,
};
exports.comp = comp;
const midLine = {
    startX: drawFunctions_js_1.canvasWidth / 2,
    startY: 0,
    endX: drawFunctions_js_1.canvasWidth / 2,
    endY: drawFunctions_js_1.canvasHeight,
    color: "#6c757d",
};
exports.midLine = midLine;
const ball = {
    x: drawFunctions_js_1.canvasWidth / 2,
    y: drawFunctions_js_1.canvasHeight / 2,
    r: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#1E1B37",
};
exports.ball = ball;
