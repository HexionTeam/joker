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
