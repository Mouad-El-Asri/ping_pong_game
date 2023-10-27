import {
    canvas,
    canvasWidth,
    canvasHeight,
    drawRect,
    drawBall,
    drawLine,
    drawScore,
} from "./drawFunctions";

import { player_1, player_2, midLine, ball } from "./gameObjects";
import { Player, Ball } from "./interfaces";

const message: HTMLElement = document.getElementById("message") as HTMLElement;
const buttons = document.querySelectorAll<HTMLButtonElement>(".btn");
const exitButton: HTMLButtonElement = document.getElementById("exit-btn") as HTMLButtonElement;

let comp: Player = player_2;
let gameOver: Boolean = false;
let userWon: Boolean = false;
let compWon: Boolean = false;
let framePerSec: number = 50;
let isPaused: Boolean = false;
let renderingStopped: Boolean = false;
let countdown: number = 3;

function pauseGame(duration: number): void {
    isPaused = true;
    setTimeout(() => {
        isPaused = false;
    }, duration);
}

function collision(ball: Ball, player: Player): boolean {
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

function movePaddle(event: MouseEvent): void {
    let pos: DOMRect = canvas.getBoundingClientRect();
    player_1.y = event.clientY - pos.top - player_1.h / 2;
}

function movePaddleWithKeys(event: KeyboardEvent): void {
	if (event.key == "ArrowDown") {
		player_1.y += 30;
		if (player_1.y >= canvasHeight - player_1.h) {
			player_1.y = canvasHeight - player_1.h / 2;
		}
	} else if (event.key == "ArrowUp") {
		player_1.y -= 30;
		if (player_1.y <= -player_1.h / 2) {
			player_1.y = -player_1.h / 2;
		}
	}
}

function updateScore(): void {
    if (ball.x - ball.r < 0) {
        comp.score++;
        resetBall();
        pauseGame(150);
    } else if (ball.x + ball.r > canvasWidth) {
        player_1.score++;
        resetBall();
        pauseGame(150);
    }
}

function checkGameStatus(): void {
    if (player_1.score === 5) {
        userWon = true;
        gameOver = true;
    } else if (comp.score === 5) {
        compWon = true;
        gameOver = true;
    }
}

function update(): void {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    let computerLevel: number = 0.1;

    comp.y += (ball.y - (comp.y + comp.h / 2)) * computerLevel;

    if (ball.y + ball.r > canvasHeight || ball.y + ball.r < 10) {
        ball.velocityY *= -1;
    }

    let player: Player = ball.x < canvasWidth / 2 ? player_1 : comp;

    if (collision(ball, player)) {
        // where the ball hits the player
        let collidePoint: number = ball.y - (player.y + player.h / 2);

        // normalization
        collidePoint = collidePoint / (player.h / 2);

        // calculate the angle in Radian
		let angleRad = (Math.PI / 4) * collidePoint;
		if (player === player_1) {
			angleRad *= 1;
		} else if (player === comp) {
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
            canvasHeight / 2 - 70,
            midLine.color
        );
        drawLine(
            canvasWidth / 2,
            canvasHeight / 2 + 70,
            canvasWidth / 2,
            canvasHeight,
            midLine.color
        );

		renderingStopped = true;
        if (userWon) {
			message.innerHTML = "Game Over, You Won!";
        } else if (compWon) {
            message.innerHTML = "Game Over, You Lost!";
        }
		exitButton.style.display = "block";
    } else {
        drawRect(0, 0, canvasWidth, canvasHeight, "#B2C6E4");
        drawRect(player_1.x, player_1.y, player_1.w, player_1.h, player_1.color);
        drawRect(comp.x, comp.y, comp.w, comp.h, comp.color);
        drawLine(
            midLine.startX,
            midLine.startY,
            midLine.endX,
            midLine.endY,
            midLine.color
        );
        drawBall(ball.x, ball.y, ball.r, ball.color);
        drawScore(player_1.score.toString(), -50, 70, "#201E3A");
        drawScore(comp.score.toString(), 50, 70, "#201E3A");
    }
}

function game(): void {
    if (!isPaused) {
        update();
    }
    render();
}

function startBotGame(): void {
	for (const button of buttons) {
		button.style.display = "none";
	}
	console.log("Starting Game");
	message.innerHTML = `The game will start in ${countdown} seconds...`;
	let countdownInterval = setInterval(() => {
		countdown--;
		if (countdown) {
			message.innerHTML = `The game will start in ${countdown} seconds...`;
		} else {
			clearInterval(countdownInterval);
			message.innerHTML = "";
		}
	}, 1000);

	setTimeout(() => {
		canvas.addEventListener("mousemove", movePaddle);
		window.addEventListener("keydown", movePaddleWithKeys);

		pauseGame(500);
		let interval = setInterval(() => {
			if (renderingStopped) {
				console.log("hello");
				clearInterval(interval);
			}
			game();
		}, 1000 / framePerSec);
	}, 3100);
}

export default startBotGame;
