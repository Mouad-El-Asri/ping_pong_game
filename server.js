const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');

app.use(cors({
	origin: '*',
}));

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>');
});

server.listen(3000, () => {
	console.log('Server is running on http://localhost:3000');
});

io.on('connection', (socket) => {
	console.log(`New user connected : ${socket.id}`);
	socket.on('join', (message) => {
		console.log(message);
	});
	socket.on('disconnect', () => {
		console.log(`User disconnected : ${socket.id}`);
	});
});
