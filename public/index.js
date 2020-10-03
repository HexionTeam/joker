$('[required]').on('input', (e) => {
    if (e.target.classList.contains('required-left-empty')) {
        e.target.classList.remove('required-left-empty');
    }
    $('[required]').popover('hide');
});

$('[required]').on('invalid', (e) => {
    //prevent the browser from showing default error bubble/ hint
    e.preventDefault();
    // optionally fire off some custom validation handler
    e.target.classList.add('required-left-empty');
    $('[required]').popover('show');
    $('[required]').focus();
});

$('#create-btn').on('click', (e) => {
    if ($('#main-form')[0].checkValidity()) {
        // move the user's view to the game
        $.toast({
            type: 'success',
            title: 'Yay!',
            content: 'Room created successfully!',
            delay: 5000
        });
    }
});