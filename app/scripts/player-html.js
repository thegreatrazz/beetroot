
const fs      = require('fs')
const id3     = require('id3-parser')
const fileUrl = require('file-url')
const path    = require('path')

let htmlCore = {
    /** Reference ID */
    refID: () => 'file',

    /** HTML5 Audio Interface */
    htmlAudio: new Audio(),
    
    /** Play song */
    play: song => {
        // if song is not passed just play
        if (song === undefined) { 
            htmlCore.htmlAudio.play()
            return
        }

        // check if the song object has a filename to read
        if (song.filename === undefined) throw new TypeError()

        // load it into the loader and play it
        htmlCore.htmlAudio.src = song.filename
        htmlCore.htmlAudio.play()
    },

    /** Pause song */
    pause: () => {
        htmlCore.htmlAudio.pause()
    },

    /**
     * 
     * @param {String} ref Reference to song
    */
    getSong: ref => {
        // check if reference
        if (typeof ref !== 'string' || !ref.startsWith(htmlCore.refID()))
            return undefined

        // load the song to fetch metadata
        let filename = ref.substring(ref.indexOf(':') + 1)
        let songBuffer = fs.readFileSync(filename)
        let id3Meta = id3.parse(songBuffer)
        if (id3Meta == false) console.warn("ID3 parser couldn't read tags")

        // return song information
        return {
            /** Song author */
            author: id3Meta.artist,

            /** Song title */
            title: id3Meta.title || path.basename(filename),

            /** Song reference */
            ref,

            /** Player core */
            core: htmlCore,

            /** Song filename */
            filename
        }
    },

    /** Called by the player system when the core is registered */
    register: (player, events) => {
        // criss-cross events between the HTMLAudio API and player system

        // play next song when this one ends
        htmlCore.htmlAudio.addEventListener('ended', () => player.next())
    },

    /** Is the player paused */
    isPaused: () => {
        return htmlCore.htmlAudio.paused
    },

    coreActive: () => {
        return htmlCore.htmlAudio.src !== ''
    }
}

module.exports = htmlCore
