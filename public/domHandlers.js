function exitToMainFrame(event) {
    try {
        window.serverSocket.disconnect();
    } catch (error) {
        console.log(error);
    }
    window.serverSocket = null;
    switchFrame('main-frame');
}

$('[required]').on('input', (e) => {
    if (e.target.classList.contains('required-left-empty')) {
        e.target.classList.remove('required-left-empty');
    }
    $('[required]').popover('hide');
});

$('[required]').on('invalid', (e) => {
    // prevent the browser from showing default error popover
    e.preventDefault();

    e.target.classList.add('required-left-empty');
    $('[required]').focus();
});

$('#create-btn').on('click', (e) => {
    if ($('#nickname-input')[0].checkValidity()) {
        if (!window.serverSocket) {
            window.serverSocket = io();
            initServerEventHandlers();
        }
        window.serverSocket.emit('create-room', $('#nickname-input').val());
    }
});

$('#join-btn').on('click', (e) => {
    if ($('#nickname-input')[0].checkValidity()) {
        toggleJoinComponent();
    }
});

$('#join-btn-2').on('click', (e) => {
    if ($('#room-code-input')[0].checkValidity()) {
        if (!window.serverSocket) {
            window.serverSocket = io();
            initServerEventHandlers();
        }
        window.serverSocket.emit('join-room', $('#nickname-input').val(), $('#room-code-input').val());
    }
});

$('#join-back-btn').on('click', (e) => {
    toggleJoinComponent();
});

$('#exit-lobby-btn').on('click', exitToMainFrame);
$('#exit-game-btn').on('click', exitToMainFrame);

$('#room-code-txt').on('click', (e) => {
    navigator.clipboard.writeText($('#room-code-txt').text());
});

$('#play-btn').on('click', (e) => {
    window.serverSocket.on('game-not-started', (reason) => {
        toastDetailedError(reason);
    });

    window.serverSocket.emit('start-game');
});