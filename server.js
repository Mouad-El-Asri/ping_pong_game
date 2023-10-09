const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

import { player_1, player_2, ball } from "./gameObjects";

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
        if (rooms.length > 0 && rooms[rooms.length - 1].players.length === 1) {
            room = rooms[rooms.length - 1];
        }

        if (room) {
            socket.join(room.id);
            socket.emit("player-number", 2);

			room.players.push({
				socket: socket,
				playerNumber: 2,
				player: player_2,
			});

            io.to(room.id).emit("start-game");
        } else {
            room = {
                id: rooms.length + 1,
                roomPlayers: [
                    {
                        socket: socket,
                        playerNumber: 1,
						player: player_1,
                    },
                ],
				roomBall: ball,
            };
            rooms.push(room);
            socket.join(room.id);
            socket.emit("player-number", 1);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected : ${socket.id}`);
    });
});
