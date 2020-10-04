const express = require('express');
const app = express();
app.use(express.static('public'));
const server = app.listen(80, () => { console.log('Listening...') });
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
        username = username.trim();

        // user has no existing rooms
        if (Object.keys(socket.rooms).length == 1 && username.match(/^[^@#]+$/)) {
            var roomId = generateRoomId();

            // save room details
            rooms[roomId] = {
                'admin': {
                    'username': username,
                    'socket': socket
                }
            };

            // add the user to the new room
            socket.join(roomId);

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