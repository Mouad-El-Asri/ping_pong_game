const io = require('socket.io')(3000, {
	cors: {
		origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
	},
})

console.log('Server is running on http://localhost:3000');

io.on('connection', socket => {
	console.log('New user connected : ');
	console.log(socket.id);
});
