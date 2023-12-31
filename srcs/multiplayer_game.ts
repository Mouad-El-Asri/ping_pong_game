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
import { Room } from "./interfaces";
import io from "socket.io-client";

const message: HTMLElement = document.getElementById("message") as HTMLElement;
const buttons = document.querySelectorAll<HTMLButtonElement>(".btn");
const exitButton: HTMLButtonElement = document.getElementById("exit-btn") as HTMLButtonElement;

const socket = io("http://localhost:3000", {
    transports: ["websocket"],
});

socket.on("connect", () => {
    console.log(`You connected to the server with id : ${socket.id}`);
});

let gameStarted: boolean = false;
let playerNumber: number = 0;
let roomID: string = "";
let countdown: number = 3;

function startGame(): void {
	for (const button of buttons) {
		button.style.display = "none";
	}
    let interval = setInterval(() => {
        if (socket.connected) {
            clearInterval(interval);
            message.innerHTML = "Waiting for opponent to join...";
            socket.emit("join-room");
        } else {
            message.innerHTML =
                "Failed to connect to server, please try again later";
        }
    }, 50);
}

function render(room: Room): void {
    if (room.winner) {
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

        if (room.winner === playerNumber) {
			if (room.gameAbondoned) {
				message.innerHTML = "Game abondoned, You Won!";
			} else { 
				message.innerHTML = "Game Over, You Won!";
			}
        } else {
			message.innerHTML = "Game Over, You Lost!";
        }
		exitButton.style.display = "block";
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

socket.on("player-number", (num: number) => {
    console.log(`You are player : ${num}`);
    playerNumber = num;
});

socket.on("start-game", () => {
    console.log("Starting game.");
    gameStarted = true;
    setTimeout(() => {
        message.innerHTML = `The game will start in ${countdown} seconds...`;
    }, 500);

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown) {
            message.innerHTML = `The game will start in ${countdown} seconds...`;
        } else {
            clearInterval(countdownInterval);
            message.innerHTML = "";
        }
    }, 1000);
});

socket.on("game-started", (room: Room) => {
    console.log(`Game started with room id : ${room.id}`);
    roomID = room.id;

    player_1.x = room.roomPlayers[0].x;
    player_1.y = room.roomPlayers[0].y;
    player_1.score = room.roomPlayers[0].score;

    player_2.x = room.roomPlayers[1].x;
    player_2.y = room.roomPlayers[1].y;
    player_2.score = room.roomPlayers[1].score;

    ball.x = room.roomBall.x;
    ball.y = room.roomBall.y;

    let pos: DOMRect = canvas.getBoundingClientRect();
    canvas.addEventListener("mousemove", (event: MouseEvent) => {
        if (gameStarted) {
            socket.emit("update-player", {
                playerNumber: playerNumber,
                roomID: roomID,
				direction: "mouse",
                event: event.clientY,
                position: pos,
            });
        }
    });

	window.addEventListener("keydown", (event: KeyboardEvent) => {
		if (event.key === "ArrowUp") {
			socket.emit("update-player", {
				playerNumber: playerNumber,
				roomID: roomID,
				direction: "up",
				position: pos,
			});
		} else if (event.key === "ArrowDown") {
			socket.emit("update-player", {
				playerNumber: playerNumber,
				roomID: roomID,
				direction: "down",
				position: pos,
			});
		}
	});

    render(room);
});

socket.on("update-game", (room: Room) => {
    ball.x = room.roomBall.x;
    ball.y = room.roomBall.y;
    ball.r = room.roomBall.r;
    ball.velocityX = room.roomBall.velocityX;
    ball.velocityY = room.roomBall.velocityY;
    ball.speed = room.roomBall.speed;

    player_1.y = room.roomPlayers[0].y;
    player_2.y = room.roomPlayers[1].y;

    player_1.score = room.roomPlayers[0].score;
    player_2.score = room.roomPlayers[1].score;

    render(room);
});

socket.on("endGame", (room: Room) => {
    console.log("Game Over.");
    gameStarted = false;
    render(room);
    socket.emit("leave", roomID);
});

export default startGame;
