function switchFrame(targetFrame) {
    // hide all existing frames
    $('[frame]').not(`#${targetFrame}`).hide();

    // show target frame
    $(`#${targetFrame}`).show();
}

function initLobbyFrame(isRoomAdmin) {
    window.serverSocket = io();

    if (isRoomAdmin) {
        window.serverSocket.on('room', (details) => {
            if (details.status == 'success') {
                switchFrame('lobby-frame');
                $.toast({
                    type: 'success',
                    title: 'Yay!',
                    content: 'Room created successfully!',
                    delay: 5000
                });
            } else {
                $.toast({
                    type: 'error',
                    title: 'Oh...',
                    content: 'Failed to create a room.',
                    delay: 5000
                });
                window.serverSocket.disconnect();
                window.serverSocket = null;
            }
        });

        window.serverSocket.emit('create-room', $('#nickname-input').val());
    } else {
        // lobby frame initialization in case of 'Join Room'.
    }
}