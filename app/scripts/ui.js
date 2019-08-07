/**
 * Beetroot UI
 * 
 * This module is meant to glue the different modules to the user interface
 * rather than having a huge spagetti mess in each module.
 * 
 * While the initialisation code for the modules are in script.js, this module
 * will connect the UI to the backend.
 * 
 * It will be inserted into regular JS after script.js.
 */

const $      = require('jquery')
const player = require('./player')
const i18n   = require('./i18n')

// macOS && Linux don't need window controls
if (process.platform === "darwin" || process.platform === "linux") {
    $("#titlebar-controls [data-window-action]").remove()
}

// Window Controls
$("[data-window-action]").click(ev => {
    console.log(ev.currentTarget)

    switch ($(ev.currentTarget).attr("data-window-action")) {
        case "minimize":
            electron.getCurrentWindow().minimize()
            break

        case "close":
            // Closing protocol, do properly later
            electron.getCurrentWindow().close()
            break
    }
})

//
// Player system
//

// Buttons

$('.player-play').click(ev => {
    if (player.isPaused()) { player.play(); console.log('play') }
    else                   { player.pause(); console.log('pause') }
})

$(".player-skip").click(ev => {
    player[$(ev.currentTarget).attr("data-player-action")]();
});

// Listen on player events

player.on('play', song => {
    $('.fa-play')
        .removeClass('fa-play')
        .addClass('fa-pause')

    $('header .song-artist').text(song.author || i18n.getString('body.noAuthor'))
    $('header .song-title' ).text(song.title)
    $('.player-status').addClass('playing')
})
