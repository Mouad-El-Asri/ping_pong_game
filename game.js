import {
	canvasWidth,
	canvasHeight,
	drawRect,
	drawBall,
	drawLine,
	drawScore
  } from './drawFunctions.js';

import {
	user,
	comp,
	midLine,
	ball
   } from './gameObjects.js';

function render() {
	drawRect(0, 0, canvasWidth, canvasHeight, "#B2C6E4");
	drawRect(user.x, user.y, user.w, user.h, user.color);
	drawRect(comp.x, comp.y, comp.w, comp.h, comp.color);
	drawLine(midLine.startX, midLine.startY, midLine.endX, midLine.endY, midLine.color);
	drawBall(ball.x, ball.y, ball.r, ball.color);
	drawScore(0, -50, 70, "#201E3A");
	drawScore(0, 50, 70, "#201E3A");
}

function collision(ball, player) {
	const playerTop = player.y;
	const playerBottom = player.y + player.h;
	const playerLeft = player.x;
	const playerRight = player.x + player.w;

	const ballTop = ball.y - ball.r;
	const ballBottom = ball.y + ball.r;
	const ballLeft = ball.x - ball.r;
	const ballRight = ball.x + ball.r;
	
	return (ballRight > playerLeft && ballTop < playerBottom && ballLeft < playerRight && ballBottom > playerTop);
}

function update() {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;
	if (ball.y + ball.r >= canvasHeight || 
		ball.y + ball.r <= 0) {
			ball.velocityY *= -1;
	}

	let player = (ball.x < canvasWidth / 2) ? user : comp;

	if (collision(ball, player)) {
		let collidePoint = ball.y - (player.y + player.h / 2);
		collidePoint = collidePoint / (player.h / 2);
		let angleRad = (Math.PI / 4) * collidePoint;

		let direction = (ball.x < canvasWidth / 2) ? 1 : -1;

		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = direction * ball.speed * Math.sin(angleRad);

		ball.speed += 0.2;
	}
}

function game()
{
	update();
	render();
}

const framePerSec = 50;

setInterval(game, 1000 / framePerSec);
