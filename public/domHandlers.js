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
    $('[required]').popover('show');
    $('[required]').focus();
});

$('#create-btn').on('click', (e) => {
    if ($('#main-form')[0].checkValidity()) {
        if (!window.serverSocket) {
            window.serverSocket = io();
            window.serverSocket.on('room', (details) => {
                if (details.status == 'success') {
                    initLobbyFrame(true);
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
                }
            });

            window.serverSocket.on('user-disconnecting', (username) => {
                $.toast({
                    type: 'info',
                    title: 'Byebye!',
                    content: `${username} left the room.`,
                    delay: 5000
                });
            });
        }
        window.serverSocket.emit('create-room', $('#nickname-input').val());
    }
});

$('#exit-btn').on('click', (e) => {
    try {
        window.serverSocket.disconnect();
    } catch (error) {
        console.log(error);
    }
    window.serverSocket = null;
    switchFrame('main-frame');
});

$('#room-code-txt').on('click', (e) => {
    navigator.clipboard.writeText($('#room-code-txt').text());
})

/**
 * Use this to append the new player to the players list in the player joined event handler
$('#players-list').append('<div class="col-3 pb-4"> \
    <div class="card player"> \
        <div class="card-body"> \
            <div class="row justify-content-center"> \
                <h3 class="card-title my-0 text-trunca te">Idan</h3> \
            </div>\
        </div>\
    </div>\
</div>')
 */