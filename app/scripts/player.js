
const EventEmitter = require('events')
let events = new EventEmitter()

/** Functions for interaction with the music player system */
let player = {
    /** A list of song objects */
    playlist: [ ],

    /** The currently playing song */
    playlistIndex: -1,

    /** Whether this playlist is playing randomly */
    random: false,

    /** The list of indexes to be played randomly */
    randomList = [ ],

    /** The cores of various players */
    playerCores: { },

    /** Listen to an event */
    on: (...args) => events.on(...args),

    /** Listen to an eventy once */
    off: (...args) => events.once(...args),

    /** Get the current song's playing core */
    getCurrentCore: () => this.playlist[this.playlistIndex].core,

    /** Play a song from the playlist */
    play: index => {
        // stop the current song
        this.getCurrentCore().pause()

        this.playlistIndex = index
        let song = this.playlist[index]
        let core = song.core
        core.play(song)

        // emit an event
        events.emit('play', song)
    },

    /** Pause the currently playing song */
    pause: () => {
        this.getCurrentCore().pause()
        events.emit('pause')
    },

    /** Resume the currently playing song (from pause) */
    resume: () => {
        this.getCurrentCore().play()
        events.emit('play', this.playlist[this.playlistIndex])
    },

    /** Go one song back */
    back: () => {
        if (--this.playlistIndex < 0)
            this.playlistIndex = this.playlist.length - 1
        this.play(this.playlistIndex)
    },

    /** Go ones song next */
    next: () => {
        if (++this.playlistIndex > this.playlist.length)
            this.playlistIndex = 0
        this.play(this.playlistIndex)
    },

    /** Look up song */
    lookup: ref => {
        if (typeof ref !== 'string') return undefined
        
        let coreID = ref.substring(0, ref.indexOf(':'))
        let core = this.playerCores[coreID]

        return core.getSong(ref)
    },

    /** Add song to playlist */
    addSong: song => {
        if (typeof song      !== 'object') throw new TypeError('Song is invalid')
        if (typeof song.ref  !== 'string') throw new TypeError('Non-existent song reference')
        if (typeof song.core !== 'object') throw new TypeError('Song doesn\'t belong to an installed core')

        this.playlist.push(song)
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
            core.register(this, events)

            // get the core ID and save the core as that
            let coreID = core.refID()
            this.playerCores[coreID] = core
        }
    }
}

// register HTML audio as a playable core
player.playerCores['file'] = require('./player-html')

module.exports = player