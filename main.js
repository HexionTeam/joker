const colors = require('colors');
const logger = require('./logger.js');
const express = require('express');
const app = express();
app.use(express.static('public'));
const server = app.listen(80, () => { logger.info('server started') });
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
                'gameStatus': 'lobby',
                'users': {}
            }
            rooms[roomId].users[socket.id] = {
                'username': username,
                'isAdmin': true
            }

            // add the user to the new room
            socket.join(roomId);

            // send the room ID
            socket.emit('room', {
                'status': 'created',
                'roomId': roomId
            });
            logger.createRoomSuccess(roomId, username);

        } else {
            socket.emit('room', { 'status': 'creation-failed' });
            logger.createRoomFail(username);
        }
    });

    socket.on('join-room', (username, roomId) => {
        username = username.trim();

        // user has no existing rooms, and the username is not used in the given room
        if (Object.keys(socket.rooms).length == 1 && username.match(/^[^@#]+$/) && rooms[roomId] && rooms[roomId].users &&
            !Object.values(rooms[roomId].users).map((user) => user.username).includes(username)) {

            // save room details
            rooms[roomId].users[socket.id] = {
                'username': username,
                'isAdmin': false
            }

            // add the user to the new room
            socket.join(roomId);

            // send the room ID
            socket.emit('room', {
                'status': 'joined',
                'roomId': roomId,
                'roomDetails': rooms[roomId]
            });

            io.sockets.in(roomId).emit('joined', username);
            logger.joinRoomSuccess(roomId, username);

        } else {
            socket.emit('room', { 'status': 'join-failed' });
            logger.joinRoomFail(roomId, username);
        }
    });

    socket.on('start-game', () => {
        Object.keys(socket.rooms).forEach((room) => {
            if (rooms[room] && rooms[room].users && rooms[room].users[socket.id]) {
                // game is unplayable with less than 3 players
                if (Object.keys(rooms[room].users).length < 3) {
                    io.sockets.in(room).emit('game-not-started', 'At least 3 players are required to play.');
                }
                else if (!rooms[room].users[socket.id].isAdmin) {
                    io.sockets.in(room).emit('game-not-started', "You're not this room's admin.");
                }
                else {
                    // shuffle the positions of the users
                    let users = Object.values(rooms[room].users);
                    users.sort(() => Math.random() - 0.5);

                    // change the room's status and notify the users
                    rooms[room].gameStatus = 'ingame';
                    io.sockets.in(room).emit('game-started', users);
                }
            }
        });
    });

    socket.on('disconnecting', (reason) => {
        let id = socket.id;
        Object.keys(socket.rooms).forEach((room) => {
            if (rooms[room] && rooms[room].users && rooms[room].users[id]) {
                let user = rooms[room].users[id];

                // notify about the user's disconnection
                io.sockets.in(room).emit('user-disconnecting', user.username);
                logger.notifyDisconnecting(room, user.username);

                switch (rooms[room].gameStatus) {
                    case 'lobby':
                        // remove the user from the room
                        delete rooms[room].users[id];

                        // close the room if its empty
                        if (Object.keys(rooms[room].users).length == 0) {
                            delete rooms[room];
                        }
                        else if (user.isAdmin) {
                            // replace current admin
                            let roomUsers = Object.keys(rooms[room].users);
                            rooms[room].users[roomUsers[0]].isAdmin = true;

                            // notify the room about the change
                            io.sockets.in(room).emit('new-admin', rooms[room].users[roomUsers[0]].username);
                            console.log('new-admin', rooms[room].users[roomUsers[0]].username);
                        }
                        break;

                    case 'ingame':
                        // set this variable later when the game is implemented.
                        // if the game was ended by a disconnection, it should be false.
                        // else, the game was ended by a victory, show results and decks should be shown.
                        let showResults = false;
                        io.sockets.in(room).emit('game-ended', showResults);
                        delete rooms[room];
                        break;
                    default:
                        break;
                }
            }
        });
    });
});
