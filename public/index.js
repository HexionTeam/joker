function switchFrame(targetFrame) {
    // hide all existing frames
    $('[frame]').not(`#${targetFrame}`).hide();

    // show target frame
    $(`#${targetFrame}`).show();
}

function initLobbyFrame(isRoomAdmin, roomId) {
    // reset the lobby details
    $('#players-list').empty();
    $('#player-count').text('1');

    // set the code of the room
    $('#room-code-txt').text(roomId);

    if (!isRoomAdmin) {
        $('#play-btn').hide();
    }
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
            switchFrame('lobby-frame');
            toastCreateSuccess();
        }
        else if (details.status == 'creation-failed') {
            toastCreateFailed();
        }
        else if (details.status == 'joined') {
            initLobbyFrame(false, details.roomId);
            details.roomDetails.forEach((user) => {
                appendPlayerToPlayerList(user.username);
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
        // increment the count of players in the lobby
        $('#player-count').text((parseInt($('#player-count').text()) + 1));
        appendPlayerToPlayerList(username);
        toastUserJoined(username);
    });

    window.serverSocket.on('user-disconnecting', (username) => {
        toastUserLeft(username);
        // remove the user from the players list
        $(`[data-username="${username}"]`).remove();
    });

    window.serverSocket.on('new-admin', (username) => {
        // the new admin is me
        if (username == $('#nickname-input').val()) {
            $('#play-btn').show();
            toastNewAdmin();
        }
    });

    window.serverSocket.on('game-started', () => {
        switchFrame('none');
    });
}