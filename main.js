const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

var rooms = {};

function generateRoomId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let roomId = '';

    do {
        roomId = '';
        for (let i = 0; i < 5; i++) {
            roomId += chars[Math.floor(Math.random() * 61)];
        }
    } while (io.sockets.adapter.rooms[roomId]);

    return roomId;
}

io.on('connection', (socket) => {
    socket.on('create-room', async (username) => {
        // user has no existing rooms
        if (Object.keys(socket.rooms).length == 1 && socket.rooms == socket.id) {
            var roomId = generateRoomId();

            // create the room
            var newRoom = rooms[roomId] = {
                'admin': {
                    'username': username,
                    'socket': socket
                }
            };

            // send the room ID
            socket.emit('room', {
                'status': 'success',
                'roomId': roomId
            });

        } else {
            socket.emit('room', { 'status': 'fail' });
        }
    });
});

io.listen(3000);