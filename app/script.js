/*
 * Beetroot DJ Panel - Rendering Process
 *
 * This is the main file which the HTML page calls upon.
 * It's responsible for including and setting up the the page and it's dependents.
 *
 */

//** COMPONENTS **///

// Others
const electron = require("electron").remote;
const fileUrl = require("file-url");
const path = require("path");
const $ = require("jquery");

// Beetroot components
const settings = require("./scripts/settings");
const i18n = require("./scripts/i18n");
const library = require("./scripts/library");
const overlays = require("./scripts/overlays");
const player = require("./scripts/player");
const server = require("./scripts/server");
const ui     = require('./scripts/ui')

//** COMPONENT HOOKS **//

function listMusicQueue() {
    let htmlQueue = $("#song-queue").empty();
    let songQueue = player.playlist;

    songQueue.forEach((val, i) => {
        let song = val
        /*
                <li>
                    <div class="song-info">
                        <span class="song-artist">A really long author name for testing for no reason (actually, there is)</span>
                        <span class="song-title">Daft Punk - Get Lucky (Official Audio) ft. Pharrell Williams, Nile Rodgers.mp3</span>
                    </div>
                    <div class="song-actions">
                        <a href="#"><i class="fas fa-fw fa-check"></i></a>
                        <a href="#"><i class="fas fa-fw fa-times"></i></a>
                    </div>
                </li> */

        let li = $('<li />')

        let songArtist = $("<div class='song-artist' />").text(song.author || '???');
        let songTitle = $("<div class='song-title' />").text(song.title || path.basename(player.playlist[i].filename));
        $("<div class='song-info' />")
            .append(songArtist)
            .append(songTitle)
            .appendTo(li);

        /*
                    <div class="song-actions">
                        <a href="#"><i class="fas fa-fw fa-chevron-up"></i></a>
                        <a href="#"><i class="fas fa-fw fa-chevron-down"></i></a>
                        <a href="#"><i class="fas fa-fw fa-times"></i></a>
                    </div> */
        let moveUpBtn = $(
            "<a href='#'><i class='fas fa-fw fa-chevron-up' /></a>"
        );
        let moveDownBtn = $(
            "<a href='#'><i class='fas fa-fw fa-chevron-down' /></a>"
        );
        let removeBtn = $("<a href='#'><i class='fas fa-fw fa-times' /></a>").click(ev => {
            console.log('remove this song')
        })
        $("<div class='song-actions' />")
            .append(moveUpBtn)
            .append(moveDownBtn)
            .append(removeBtn)
            .appendTo(li)

        li.appendTo(htmlQueue);
    });
}

// Hook into the setting of ui.language
settings.hooks.push((key, content) => {
    // Don't do anythign if this not out key
    if (key !== "ui.language") return;

    // Ok it is... Set the new language
    i18n.setLanguage(content);
});

player.on("play", x => {
    $(".fa-play")
        .removeClass("fa-play")
        .addClass("fa-pause");
    $("header .song-artist").text(x.artist || i18n.getString("body.noAuthor"));
    $("header .song-title").text(
        x.title || path.basename(player.playlist[player.playlistIndex].filename)
    );
    $(".player-status").addClass("playing");
});
player.on("resume", x => {
    $(".fa-play")
        .removeClass("fa-play")
        .addClass("fa-pause");
    $(".player-status").addClass("playing");
});
player.on("pause", x => {
    $(".fa-pause")
        .removeClass("fa-pause")
        .addClass("fa-play");
    $(".player-status").removeClass("playing");
});

//** INITIALISATION **//

// Load the settings on start-up
settings.load();

// Load the default language before moving on
i18n.setLanguage(settings.get("ui.language"));

// Update the music files
library.updateMusicFiles();

// Buttons for adding folders to playlist
$("#librarycfg > a:nth-child(5)").click(ev => {
    let files = library.getMusicFiles()
    setTimeout(() => {
        files.forEach(val => {
            let song = player.lookup(`file:${val}`)
            player.addSong(song)
            listMusicQueue()
        })
    }, 1000)
});
