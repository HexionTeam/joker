function toastCreateSuccess() {
    $.toast({
        type: 'success',
        title: 'Yay!',
        content: 'Room created successfully!',
        delay: 5000
    });
}

function toastCreateFailed() {
    $.toast({
        type: 'error',
        title: 'Oh...',
        content: 'Failed to create a room.',
        delay: 5000
    });
}

function toastJoinSuccess() {
    $.toast({
        type: 'success',
        title: 'Yay!',
        content: `Joined successfully!`,
        delay: 5000
    });
}

function toastJoinFailed() {
    $.toast({
        type: 'error',
        title: 'Oh...',
        content: 'Failed to join the room.',
        delay: 5000
    });
}

function toastGeneralError() {
    $.toast({
        type: 'error',
        title: 'Wait what?',
        content: 'Invalid data was received from the server.',
        delay: 5000
    });
}

function toastDetailedError(message) {
    $.toast({
        type: 'error',
        title: 'Oops...',
        content: message,
        delay: 5000
    });
}

function toastUserLeft(username) {
    $.toast({
        type: 'info',
        title: 'Byebye!',
        content: `${username} left the room.`,
        delay: 5000
    });
}

function toastUserJoined(username) {
    $.toast({
        type: 'info',
        title: 'Welcome!',
        content: `${username} join the room.`,
        delay: 5000
    });
}

function toastNewAdmin() {
    $.toast({
        type: 'info',
        title: 'Hurray!',
        content: `You're the new admin of this room!`,
        delay: 5000
    });
}