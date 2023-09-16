import {
	canvasWidth,
	canvasHeight,
  } from './drawFunctions.js';

export const user = {
	x : 10,
	y : canvasHeight / 2 - 100 / 2,
	w : 12,
	h : 100,
	color: "#211F3C",
	score : 0
}

export const comp = {
	x : canvasWidth - 20,
	y : canvasHeight / 2 - 100 / 2,
	w : 12,
	h : 100,
	color: "#211F3C",
	score : 0
}

export const midLine = {
	startX : canvasWidth / 2,
	startY : 0,
	endX : canvasWidth / 2,
	endY : canvasHeight,
	color : "#6c757d"
}

export const ball = {
	x : canvasWidth / 2,
	y : canvasHeight / 2,
	r : 10,
	speed : 5,
	// velocity = speed + direction
	velocityX : 5,
	velocityY : 5,
	color : "#1E1B37"
}