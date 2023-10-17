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

let comp: Player = player_2;

class BootPongGame {
    gameOver: boolean;
    userWon: boolean;
    compWon: boolean;
    framePerSec: number;
    isPaused: boolean;
	renderingStopped: boolean;
	countdown: number;

    constructor() {
        this.gameOver = false;
        this.userWon = false;
        this.compWon = false;
        this.framePerSec = 50;
        this.isPaused = false;
		this.renderingStopped = false;
		this.countdown = 3;
    }

    pauseGame(duration: number): void {
        this.isPaused = true;
        setTimeout(() => {
            this.isPaused = false;
        }, duration);
    }

    collision(ball: Ball, player: Player): boolean {
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

    resetBall(): void {
        ball.x = canvasWidth / 2;
        ball.y = canvasHeight / 2;
        ball.velocityX *= -1;
    }

    movePaddle(event: MouseEvent): void {
        let pos: DOMRect = canvas.getBoundingClientRect();
        player_1.y = event.clientY - pos.top - player_1.h / 2;
    }

	movePaddleWithKeys(event: KeyboardEvent): void {
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

    updateScore(): void {
        if (ball.x - ball.r < 0) {
            comp.score++;
            this.resetBall();
            this.pauseGame(150);
        } else if (ball.x + ball.r > canvasWidth) {
            player_1.score++;
            this.resetBall();
            this.pauseGame(150);
        }
    }

    checkGameStatus(): void {
        if (player_1.score === 5) {
            this.userWon = true;
            this.gameOver = true;
        } else if (comp.score === 5) {
            this.compWon = true;
            this.gameOver = true;
        }
    }

    update(): void {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        let computerLevel: number = 0.1;

        comp.y += (ball.y - (comp.y + comp.h / 2)) * computerLevel;

        if (ball.y + ball.r > canvasHeight || ball.y + ball.r < 10) {
            ball.velocityY *= -1;
        }

        let player: Player = ball.x < canvasWidth / 2 ? player_1 : comp;

        if (this.collision(ball, player)) {
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

        this.updateScore();
        this.checkGameStatus();
    }

    render(): void {
        if (this.gameOver) {
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

			this.renderingStopped = true;
            if (this.userWon) {
				message.innerHTML = "Game Over, You Won!";
            } else if (this.compWon) {
                message.innerHTML = "Game Over, You Lost!";
            }
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

    game(): void {
        if (!this.isPaused) {
            this.update();
        }
        this.render();
    }

    startGame(): void {
		for (const button of buttons) {
			button.style.display = "none";
		}
		console.log("Starting Game");
		message.innerHTML = `The game will start in ${this.countdown} seconds...`;
		let countdownInterval = setInterval(() => {
			this.countdown--;
			if (this.countdown) {
				message.innerHTML = `The game will start in ${this.countdown} seconds...`;
			} else {
				clearInterval(countdownInterval);
				message.innerHTML = "";
			}
		}, 1000);
		
		setTimeout(() => {
			canvas.addEventListener("mousemove", this.movePaddle);
			window.addEventListener("keydown", this.movePaddleWithKeys);
	
			this.pauseGame(500);
			let interval = setInterval(() => {
				if (this.renderingStopped) {
					console.log("hello");
					clearInterval(interval);
				}
				this.game();
			}, 1000 / this.framePerSec);
		}, 3100);
    }
}

export default BootPongGame;
