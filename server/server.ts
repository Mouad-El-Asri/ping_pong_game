const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

import { Request, Response } from "express";
import { Socket } from 'socket.io';
import { Room, RoomPlayer, RoomBall, Data } from "../srcs/interfaces";

let rooms: Room[] = [];
let framePerSec: number = 50;
let isPaused: boolean = false;

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Hello World!</h1>");
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

io.on("connection", (socket: Socket) => {
    console.log(`New user connected : ${socket.id}`);

    socket.on("join-room", () => {
        let room;
        if (
            rooms.length > 0 &&
            rooms[rooms.length - 1].roomPlayers.length === 1
        ) {
            room = rooms[rooms.length - 1];
        }

        if (room) {
            socket.join(room.id);
            socket.emit("player-number", 2);

            room.roomPlayers.push({
                socketId: socket.id,
                playerNumber: 1,
                x: 1088 - 20,
                y: 644 / 2 - 100 / 2,
                h: 100,
                w: 6,
                score: 0,
            });

            io.to(room.id).emit("start-game");

            setTimeout(() => {
                io.to(room.id).emit("game-started", room);
				pauseGame(500);
                startRoomGame(room);
            }, 3100);
        } else {
            room = {
				stopRendering: false,
                winner: 0,
                id: (rooms.length + 1).toString(),
                roomPlayers: [
                    {
                        socketId: socket.id,
                        playerNumber: 2,
                        x: 10,
                        y: 644 / 2 - 100 / 2,
                        h: 100,
                        w: 6,
                        score: 0,
                    },
                ],
                roomBall: {
                    x: 1088 / 2,
                    y: 644 / 2,
                    r: 10,
                    speed: 7,
                    velocityX: 7,
                    velocityY: 7,
                },
            };
            rooms.push(room);
            socket.join(room.id);
            socket.emit("player-number", 1);
        }
    });

    socket.on("update-player", (data: Data) => {
        const room = rooms.find((room) => room.id === data.roomID);

        if (room) {
			if (data.direction === "mouse") {
				room.roomPlayers[data.playerNumber - 1].y = data.event - data.position.top - 100 / 2;
			} else if (data.direction === "up") {
				room.roomPlayers[data.playerNumber - 1].y -= 30;
				if (room.roomPlayers[data.playerNumber - 1].y <= -50) {
					room.roomPlayers[data.playerNumber - 1].y = -50;
				}
			} else if (data.direction === "down") {
				room.roomPlayers[data.playerNumber - 1].y += 30;
				if (room.roomPlayers[data.playerNumber - 1].y + 100 >= 644) {
					room.roomPlayers[data.playerNumber - 1].y = 644 - 100 / 2;
				}
			}
        }

        rooms = rooms.map((oldRoom) => {
            if (room && oldRoom.id === room.id) {
                return room;
            } else {
                return oldRoom;
            }
        });

		if (room) {
			io.to(room.id).emit("update-game", room);
		}
    });

    socket.on("leave", (roomID: string) => {
		socket.leave(roomID);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected : ${socket.id}`);
		let room = findRoomBySocketId(socket.id);
		if (room) {
			room.stopRendering = true;
			if (room.roomPlayers[0].socketId == socket.id) {
				room.winner = 2;
			} else {
				room.winner = 1;
			}
			io.to(room.id).emit("endGame", room);
		}
    });
});

function findRoomBySocketId(socketId: string) {
	for (const room of rooms) {
        const playerInRoom = room.roomPlayers.find(player => player.socketId === socketId);
        if (playerInRoom) {
            return room;
        }
    }
    return null;
}

function resetBall(room: Room) {
    room.roomBall.x = 1088 / 2;
    room.roomBall.y = 644 / 2;
    room.roomBall.velocityX *= -1;
}

function pauseGame(duration: number) {
    isPaused = true;
    setTimeout(() => {
        isPaused = false;
    }, duration);
}

function updateScore(room: Room) {
    if (room.roomBall.x - room.roomBall.r < 0) {
        console.log(`player 2 scored in room : ${room.id}`);
        room.roomPlayers[1].score++;
        resetBall(room);
        pauseGame(500);
    } else if (room.roomBall.x + room.roomBall.r > 1088) {
        console.log(`player 1 scored in room : ${room.id}`);
        room.roomPlayers[0].score++;
        resetBall(room);
        pauseGame(500);
    }
}

function collision(ball: RoomBall, player: RoomPlayer) {
    const playerTop = player.y;
    const playerBottom = player.y + player.h;
    const playerLeft = player.x;
    const playerRight = player.x + player.w;

    const ballTop = ball.y - ball.r;
    const ballBottom = ball.y + ball.r;
    const ballLeft = ball.x - ball.r;
    const ballRight = ball.x + ball.r;

    return (
        ballRight > playerLeft &&
        ballTop < playerBottom &&
        ballLeft < playerRight &&
        ballBottom > playerTop
    );
}

function startRoomGame(room: Room) {
    let interval = setInterval(() => {
        if (!isPaused) {
            room.roomBall.x += room.roomBall.velocityX;
            room.roomBall.y += room.roomBall.velocityY;

            if (
                room.roomBall.y + room.roomBall.r > 644 ||
                room.roomBall.y + room.roomBall.r < 10
            ) {
                room.roomBall.velocityY *= -1;
            }

            let player =
                room.roomBall.x < 1088 / 2
                    ? room.roomPlayers[0]
                    : room.roomPlayers[1];

            if (collision(room.roomBall, player)) {
                let collidePoint = room.roomBall.y - (player.y + player.h / 2);

                collidePoint = collidePoint / (player.h / 2);

                let angleRad = (Math.PI / 4) * collidePoint;
                if (player === room.roomPlayers[0]) {
                    angleRad *= 1;
                } else if (player === room.roomPlayers[1]) {
                    angleRad *= -1;
                }

                let direction = room.roomBall.x < 1088 / 2 ? 1 : -1;

                room.roomBall.velocityX =
                    direction * room.roomBall.speed * Math.cos(angleRad);
                room.roomBall.velocityY =
                    direction * room.roomBall.speed * Math.sin(angleRad);

                room.roomBall.speed += 0.2;
            }

            updateScore(room);

            if (room.roomPlayers[0].score === 5) {
                room.winner = 1;
                rooms = rooms.filter((r) => r.id !== room.id);
                io.to(room.id).emit("endGame", room);
                clearInterval(interval);
            } else if (room.roomPlayers[1].score === 5) {
                room.winner = 2;
                rooms = rooms.filter((r) => r.id !== room.id);
                io.to(room.id).emit("endGame", room);
                clearInterval(interval);
            }

			if (room.stopRendering) {
				clearInterval(interval);
			}

            io.to(room.id).emit("update-game", room);
        }
    }, 1000 / framePerSec);
}
