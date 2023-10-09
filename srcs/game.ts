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

import { player_1, player_2, midLine, ball } from "./gameObjects";
import { Player, Ball } from "./interfaces";
import io from "socket.io-client";

const message: HTMLElement = document.getElementById("message") as HTMLElement;

const socket = io("http://localhost:3000", {
    transports: ["websocket"],
});

socket.on("connect", () => {
    console.log(`You connected to the server with id : ${socket.id}`);
});

let isPaused: boolean = false;
let user1Won: boolean = false;
let user2Won: boolean = false;
let gameOver: boolean = false;
let renderingStopped: boolean = false;
let framePerSec: number = 50;
let gameStarted: boolean = false;
let playerNumber: number = 0;

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

function updateScore(): void {
    if (ball.x - ball.r < 0) {
        player_2.score++;
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
        user1Won = true;
        gameOver = true;
    } else if (player_2.score === 5) {
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

    let player: Player = ball.x < canvasWidth / 2 ? player_1 : player_2;

    if (collision(ball, player)) {
        // where the ball hits the player
        let collidePoint: number = ball.y - (player.y + player.h / 2);

        // normalization
        collidePoint = collidePoint / (player.h / 2);

        // calculate the angle in Radian
        let angleRad: number = (Math.PI / 4) * collidePoint;
        if (player == player_1) {
            angleRad *= 1;
        } else if (player == player_2) {
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
        drawRect(
            player_1.x,
            player_1.y,
            player_1.w,
            player_1.h,
            player_1.color
        );
        drawRect(
            player_2.x,
            player_2.y,
            player_2.w,
            player_2.h,
            player_2.color
        );
        drawLine(
            midLine.startX,
            midLine.startY,
            midLine.endX,
            midLine.endY,
            midLine.color
        );
        drawBall(ball.x, ball.y, ball.r, ball.color);
        drawScore(player_1.score.toString(), -50, 70, "#201E3A");
        drawScore(player_2.score.toString(), 50, 70, "#201E3A");
    }
}

function game(): void {
    if (!isPaused) {
        update();
    }
    render();
}

socket.on("player-number", (num: number) => {
    console.log(`You are player : ${num}`);
    playerNumber = num;
});

socket.on("start-game", () => {
    console.log("Starting game.");
    gameStarted = true;
    message.innerHTML = "The game will start in 3 seconds...";
});

function startGame(): void {
    setTimeout(() => {
        if (socket.connected) {
            socket.emit("join-room");
            message.innerHTML = "Waiting for opponent to join...";
        } else {
            message.innerHTML =
                "Failed to connect to server, please try again later.";
        }
    }, 150);
    // canvas.addEventListener("mousemove", (event: MouseEvent) => {
    // 	let pos: DOMRect = canvas.getBoundingClientRect();
    // 	player_1.y = event.clientY - pos.top - player_1.h / 2;
    // 	player_2.y = event.clientY - pos.top - player_2.h / 2;
    // });

    // if (!renderingStopped)
    // 	setInterval(() => game(), 1000 / framePerSec);
}

export { startGame };
