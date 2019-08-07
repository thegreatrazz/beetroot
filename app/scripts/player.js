
const EventEmitter = require('events')
let events = new EventEmitter()

/** Functions for interaction with the music player system */
let player = {
    /** A list of song objects */
    playlist: [ ],

    /** The currently playing song */
    playlistIndex: 0,

    /** Whether this playlist is playing randomly */
    random: false,

    /** The list of indexes to be played randomly */
    randomList: [ ],

    /** The cores of various players */
    playerCores: { },

    /** Is the player paused */
    isPaused: () => {
        if (player.getCurrentCore() === undefined) return true
        return player.getCurrentCore().isPaused()
    },

    /** Listen to an event */
    on: (...args) => events.on(...args),

    /** Listen to an eventy once */
    off: (...args) => events.once(...args),

    /** Get the current song's playing core */
    getCurrentCore: () => {
        let song = player.playlist[player.playlistIndex]
        if (song && song.core) return song.core
    },

    /** Play a song from the playlist */
    play: (index) => {
        if (player.playlist.length == 0) return // do nothing if we have nothing in playlist

        // if the index is undefined and song already exists, play
        if (index === undefined && player.getCurrentCore().coreActive()) {
            player.getCurrentCore().play()
            return
        }

        // clip negative indexes
        if (index < 0) index = 0

        // stop the current song
        if (player.getCurrentCore() !== undefined)
            player.getCurrentCore().pause()

        // update index and play next
        player.playlistIndex = index
        let song = player.playlist[index]
        let core = song.core
        core.play(song)

        // emit an event
        events.emit('play', song)
    },

    /** Pause the currently playing song */
    pause: () => {
        if (player.getCurrentCore() === undefined) return

        player.getCurrentCore().pause()
        events.emit('pause')
    },

    /** Resume the currently playing song (from pause) */
    resume: () => {
        if (player.getCurrentCore() === undefined) return

        player.getCurrentCore().play()
        events.emit('play', player.playlist[player.playlistIndex])
    },

    /** Go one song back */
    back: () => {
        if (--player.playlistIndex < 0)
            player.playlistIndex = player.playlist.length - 1
        player.play(player.playlistIndex)
    },

    /** Go ones song next */
    skip: () => {
        if (++player.playlistIndex > player.playlist.length)
            player.playlistIndex = 0
        player.play(player.playlistIndex)
    },

    /** Look up song */
    lookup: ref => {
        if (typeof ref !== 'string') return undefined
        
        let coreID = ref.substring(0, ref.indexOf(':'))
        let core = player.playerCores[coreID]

        return core.getSong(ref)
    },

    /** Add song to playlist */
    addSong: song => {
        if (typeof song      !== 'object') throw new TypeError('Song is invalid')
        if (typeof song.ref  !== 'string') throw new TypeError('Non-existent song reference')
        if (typeof song.core !== 'object') throw new TypeError('Song doesn\'t belong to an installed core')

        player.playlist.push(song)
        events.emit('playlist-add', song)
    },

    /** Register player */
    registerCore: core => {
        // check if the core is an object and has all the parts we need
        if (typeof core !== "object") throw new TypeError('Core is not an object')

        if (typeof core.refID    === 'function'
        &&  typeof core.play     === 'function' 
        &&  typeof core.pause    === 'function'
        &&  typeof core.getSong  === 'function'
        &&  typeof core.register === 'function') {
            // register the core
            core.register(player, events)

            // get the core ID and save the core as that
            let coreID = core.refID()
            player.playerCores[coreID] = core
        }
    }
}

// register HTML audio as a playable core
player.playerCores['file'] = require('./player-html')

module.exports = player