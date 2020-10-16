function switchFrame(targetFrame) {
    // hide all existing frames
    $('[frame]').not(`#${targetFrame}`).hide();

    // show target frame
    $(`#${targetFrame}`).show();
}

function initLobbyFrame(isRoomAdmin) {
    if (isRoomAdmin) {

    } else {
        // lobby frame initialization in case of 'Join Room'.
    }
}