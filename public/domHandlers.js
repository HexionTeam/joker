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
        initLobbyFrame(true);
    }
});

$('#exit-btn').on('click', (e) => {
    window.serverSocket.disconnect();
});