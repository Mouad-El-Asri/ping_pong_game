const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

let rooms = [];
let framePerSec = 50;
let user1Won = false;
let user2Won = false;
let gameOver = false;
let isPaused = false;

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

io.on("connection", (socket) => {
    console.log(`New user connected : ${socket.id}`);

    socket.on("join-room", () => {
        let room;
        if (rooms.length > 0 && rooms[rooms.length - 1].roomPlayers.length === 1) {
            room = rooms[rooms.length - 1];
        }

        if (room) {
            socket.join(room.id);
            socket.emit("player-number", 2);

			room.roomPlayers.push({
				socketId: socket.id,
				playerNumber: 2,
				x: 10,
				y: 644 / 2 - 100 / 2,
				h: 100,
				w: 6,
				score: 0,
			});

            io.to(room.id).emit("start-game");

			setTimeout(() => {
				io.to(room.id).emit("game-started", room);
				startRoomGame(room);
			}, 3100);
        } else {
            room = {
                id: rooms.length + 1,
                roomPlayers: [
                    {
                        socketId: socket.id,
                        playerNumber: 1,
						// replace them with canvas later
						x: 1088 - 20,
						y: 644 / 2 - 100 / 2,
						h: 100,
						w: 6,
						score: 0,
                    },
                ],
				roomBall: {
					// replace them with canvas later
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

	socket.on("update-player", (data) => {
		const room = rooms.find((room) => room.id === data.roomID);

		if (room) {
			room.roomPlayers[data.playerNumber - 1].y = data.event - data.position.top - 100 / 2;
		};

		rooms = rooms.map((oldRoom) => {
			if (oldRoom.id === room.id) {
				return room;
			}
			else {
				return oldRoom;
			}
		});

		io.to(room.id).emit("update-game", room);
	});

    socket.on("disconnect", () => {
        console.log(`User disconnected : ${socket.id}`);
    });
});

function resetBall(room) {
    room.roomBall.x = 1088 / 2;
    room.roomBall.y = 644 / 2;
    room.roomBall.velocityX *= -1;
}

function pauseGame(duration) {
    isPaused = true;
    setTimeout(() => {
        isPaused = false;
    }, duration);
}

function updateScore(room) {
    if (room.roomBall.x - room.roomBall.r < 0) {
        room.roomPlayers[1].score++;
        resetBall(room);
        pauseGame(150);
    } else if (room.roomBall.x + room.roomBall.r > 1088) {
        room.roomPlayers[0].score++;
        resetBall(room);
        pauseGame(150);
    }
}

// function checkGameStatus(room) {
//     if (room.roomPlayers[0].score === 5) {
//         user1Won = true;
//         gameOver = true;
//     } else if (room.roomPlayers[1].score === 5) {
//         user2Won = true;
//         gameOver = true;
//     }
// }

function collision(ball, player) {
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

function startRoomGame(room) {
	// if (!renderingStopped) {
	let interval = setInterval(() => {
		room.roomBall.x += room.roomBall.velocityX;
		room.roomBall.y += room.roomBall.velocityY;

		if (room.roomBall.y + room.roomBall.r > 644 || room.roomBall.y + room.roomBall.r < 10) {
			room.roomBall.velocityY *= -1;
		}

		let player = room.roomBall.x < 1088 / 2 ? room.roomPlayers[0] : room.roomPlayers[1];

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
	
			room.roomBall.velocityX = direction * room.roomBall.speed * Math.cos(angleRad);
			room.roomBall.velocityY = direction * room.roomBall.speed * Math.sin(angleRad);

			room.roomBall.speed += 0.2;
		}

		updateScore(room);
		// checkGameStatus(room);


		// if (room.players[0].score === 10) {
        //     room.winner = 1;
        //     rooms = rooms.filter(r => r.id !== room.id);
        //     io.to(room.id).emit('endGame', room);
        //     clearInterval(interval);
        // }

        // if (room.players[1].score === 10) {
        //     room.winner = 2;
        //     rooms = rooms.filter(r => r.id !== room.id);
        //     io.to(room.id).emit('endGame', room);
        //     clearInterval(interval);
        // }

		io.to(room.id).emit("update-game", room);
	}, 1000 / framePerSec);
	// }
};
