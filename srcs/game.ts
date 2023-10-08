import {
    canvas,
    canvasWidth,
    canvasHeight,
    drawRect,
    drawBall,
    drawLine,
    drawScore,
    drawText,
} from "./drawFunctions";

import { user_1, user_2, midLine, ball } from "./gameObjects";

import { Rect, Ball } from "./interfaces";

import io from "socket.io-client";

const socket = io("http://localhost:3000", {
	transports: ['websocket']
});

socket.on('connect', () => {
	console.log(`You connected to the server with id : ${socket.id}`);
});

socket.emit('join', 'hello mouad');

let isPaused: boolean = false;
let user1Won: boolean = false;
let user2Won: boolean = false;
let gameOver: boolean = false;
let renderingStopped: boolean = false;
let framePerSec: number = 50;

function pauseGame(duration: number): void {
	isPaused = true;
	setTimeout(() => {
		isPaused = false;
	}, duration);
}

function collision(ball: Ball, player: Rect): boolean {
	const playerTop: number = player.y;
	const playerBottom: number = player.y + player.h;
	const playerLeft: number = player.x;
	const playerRight: number = player.x + player.w;

	const ballTop: number = ball.y - ball.r;
	const ballBottom: number = ball.y + ball.r;
	const ballLeft: number = ball.x - ball.r;
	const ballRight: number = ball.x + ball.r;

	return (
		ballRight > playerLeft &&
		ballTop < playerBottom &&
		ballLeft < playerRight &&
		ballBottom > playerTop
	);
}

function resetBall(): void {
	ball.x = canvasWidth / 2;
	ball.y = canvasHeight / 2;
	ball.velocityX *= -1;
}

function updateScore(): void {
	if (ball.x - ball.r < 0) {
		user_2.score++;
		resetBall();
		pauseGame(150);
	} else if (ball.x + ball.r > canvasWidth) {
		user_1.score++;
		resetBall();
		pauseGame(150);
	}
}

function checkGameStatus(): void {
	if (user_1.score === 5) {
		user1Won = true;
		gameOver = true;
	} else if (user_2.score === 5) {
		user2Won = true;
		gameOver = true;
	}
}

function update(): void {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	if (ball.y + ball.r > canvasHeight || ball.y + ball.r < 10) {
		ball.velocityY *= -1;
	}

	let player: Rect = ball.x < canvasWidth / 2 ? user_1 : user_2;

	if (collision(ball, player)) {
		// where the ball hits the player
		let collidePoint: number = ball.y - (player.y + player.h / 2);

		// normalization
		collidePoint = collidePoint / (player.h / 2);

		// calculate the angle in Radian
		let angleRad: number = (Math.PI / 4) * collidePoint;
		if (player == user_1) {
			angleRad *= 1;
		} else if (player == user_2) {
			angleRad *= -1;
		}

		let direction: number = ball.x < canvasWidth / 2 ? 1 : -1;

		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = direction * ball.speed * Math.sin(angleRad);

		ball.speed += 0.2;
	}

	updateScore();
	checkGameStatus();
}

function render(): void {
	if (gameOver) {
		drawRect(0, 0, canvasWidth, canvasHeight, "#B2C6E4");
		drawLine(
			canvasWidth / 2,
			0,
			canvasWidth / 2,
			canvasHeight / 2 - 40,
			midLine.color
		);
		drawLine(
			canvasWidth / 2,
			canvasHeight / 2 + 40,
			canvasWidth / 2,
			canvasHeight,
			midLine.color
		);

		if (user1Won) {
			drawText("Game Over, You Win!", "#003366");
		} else if (user2Won) {
			drawText("Game Over, You Lose!", "#003366");
		}
		renderingStopped = true;
	} else {
		drawRect(0, 0, canvasWidth, canvasHeight, "#B2C6E4");
		drawRect(user_1.x, user_1.y, user_1.w, user_1.h, user_1.color);
		drawRect(user_2.x, user_2.y, user_2.w, user_2.h, user_2.color);
		drawLine(
			midLine.startX,
			midLine.startY,
			midLine.endX,
			midLine.endY,
			midLine.color
		);
		drawBall(ball.x, ball.y, ball.r, ball.color);
		drawScore(user_1.score.toString(), -50, 70, "#201E3A");
		drawScore(user_2.score.toString(), 50, 70, "#201E3A");
	}
}

function game(): void {
	if (!isPaused) {
		update();
	}
	render();
}

function startGame(): void {
	canvas.addEventListener("mousemove", (event: MouseEvent) => {
		let pos: DOMRect = canvas.getBoundingClientRect();
		user_1.y = event.clientY - pos.top - user_1.h / 2;
		user_2.y = event.clientY - pos.top - user_2.h / 2;
	});

	if (!renderingStopped)
		setInterval(() => game(), 1000 / framePerSec);
}

export { startGame };