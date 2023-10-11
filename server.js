const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

let rooms = [];

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
				score: 0,
			});

            io.to(room.id).emit("start-game");

			setTimeout(() => {
				io.to(room.id).emit("game-started", room);
				startRoomGame(room);
			}, 1000);
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
						score: 0,
                    },
                ],
				roomBall: {
					// replace them with canvas later
					x: 1088 / 2,
					y: 644 / 2,
				},
            };
            rooms.push(room);
            socket.join(room.id);
            socket.emit("player-number", 1);
        }
    });

	socket.on("update-player", (data) => {
		const room = rooms.find((room) => room.id === data.roomId);

		if (room) {
			room.players[data.playerNumber - 1] = data.event.clientY - data.position.top - 100 / 2;
		};

		rooms = rooms.map((oldRoom) => {
			if (oldRoom.id === room.id) {
				return room;
			}
			return oldRoom;
		});

		io.to(room.id).emit("update-game", room);
	});

    socket.on("disconnect", () => {
        console.log(`User disconnected : ${socket.id}`);
    });
});

function startRoomGame(room) {
	if (!renderingStopped) {
		setInterval(() => {
			io.to(room.id).emit("update-game", room);
		}, 1000 / framePerSec);
	}
};
