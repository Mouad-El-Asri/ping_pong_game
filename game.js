import {
	canvasWidth,
	canvasHeight,
	drawRect,
	drawBall,
	drawLine,
	drawScore
  } from './drawFunctions.js';

const user = {
	x : 10,
	y : canvasHeight / 2 - 100 / 2,
	w : 12,
	h : 100,
	color: "#211F3C",
	score : 0
}

const comp = {
	x : canvasWidth - 20,
	y : canvasHeight / 2 - 100 / 2,
	w : 12,
	h : 100,
	color: "#211F3C",
	score : 0
}

const midLine = {
	startX : canvasWidth / 2,
	startY : 0,
	endX : canvasWidth / 2,
	endY : canvasHeight,
	color : "#6c757d"
}

const ball = {
	x : canvasWidth / 2,
	y : canvasHeight / 2,
	r : 10,
	color : "#1E1B37"
}

function render() {
	drawRect(0, 0, canvasWidth, canvasHeight, "#B2C6E4");
	drawRect(user.x, user.y, user.w, user.h, user.color);
	drawRect(comp.x, comp.y, comp.w, comp.h, comp.color);
	drawLine(midLine.startX, midLine.startY, midLine.endX, midLine.endY, midLine.color);
	drawBall(ball.x, ball.y, ball.r, ball.color);
	drawScore(0, -50, 70, "#201E3A");
	drawScore(0, 50, 70, "#201E3A");
}

render();