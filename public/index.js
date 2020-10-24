function switchFrame(targetFrame) {
    // hide all existing frames
    $('[frame]').not(`#${targetFrame}`).hide();

    // hide/show the game banner
    if (targetFrame == 'game-frame') {
        $('#game-banner').hide();
    }
    else {
        $('#game-banner').show();
    }

    // show target frame
    $(`#${targetFrame}`).show();
}

function initLobbyFrame(isRoomAdmin, roomId) {
    // reset the lobby details
    $('#players-list').empty();
    $('#player-count').text('0');

    // set the code of the room
    $('#room-code-txt').text(roomId);

    if (!isRoomAdmin) {
        $('#play-btn').hide();
    }
}

function initGameFrame(users) {
    let isAdmin = users.find(user => user.username == $('#nickname-input').val())?.isAdmin ?? false;
}

function incrementPlayerCounter() {
    $('#player-count').text((parseInt($('#player-count').text()) + 1));
}

function decrementPlayerCounter() {
    $('#player-count').text((parseInt($('#player-count').text()) - 1));
}

function toggleJoinComponent() {
    $('#main-form-component').toggle();
    $('#join-form-component').toggle();
}

function appendPlayerToPlayerList(username) {
    $('#players-list').append(`<div data-username="${username}" class="col-3 pb-4">
<div class="card player">
<div class="card-body">
    <div class="row justify-content-center">
        <h3 class="card-title my-0 text-trunca te">${username}</h3>
    </div>
</div>
</div>
</div>`);
}

function initServerEventHandlers() {
    window.serverSocket.on('room', (details) => {
        if (details.status == 'created') {
            initLobbyFrame(true, details.roomId);
            appendPlayerToPlayerList($('#nickname-input').val());
            incrementPlayerCounter();
            switchFrame('lobby-frame');
            toastCreateSuccess();
        }
        else if (details.status == 'creation-failed') {
            toastCreateFailed();
        }
        else if (details.status == 'joined') {
            initLobbyFrame(false, details.roomId);
            console.log(details.roomDetails);
            Object.values(details.roomDetails.users).forEach((user) => {
                appendPlayerToPlayerList(user.username);
                incrementPlayerCounter();
            });
            switchFrame('lobby-frame');
            toastJoinSuccess();
        }
        else if (details.status == 'join-failed') {
            toastJoinFailed();
        }
        else {
            toastGeneralError();
        }
    });

    window.serverSocket.on('joined', (username) => {
        if (username == $('#nickname-input').val()) return;
        incrementPlayerCounter();
        appendPlayerToPlayerList(username);
        toastUserJoined(username);
    });

    window.serverSocket.on('user-disconnecting', (username) => {
        toastUserLeft(username);
        // remove the user from the players list
        $(`[data-username="${username}"]`).remove();
        decrementPlayerCounter();
    });

    window.serverSocket.on('new-admin', (username) => {
        // the new admin is me
        if (username == $('#nickname-input').val()) {
            $('#play-btn').show();
            toastNewAdmin();
        }
    });

    window.serverSocket.on('game-started', (users) => {
        initGameFrame(users);
        switchFrame('game-frame');
    });

    window.serverSocket.on('game-ended', () => {
        exitToMainFrame();    
    });
}