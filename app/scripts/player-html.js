
const fs      = require('fs')
const id3     = require('id3-parser')
const fileUrl = require('file-url')

let htmlCore = {
    /** Reference ID */
    refID: () => 'file',

    /** HTML5 Audio Interface */
    htmlAudio: new Audio(),
    
    /** Play song */
    play: song => {
        // if song is not passed just play
        if (song === undefined) this.htmlAudio.play()

        // check if the song object has a filename to read
        if (song.filename === undefined) throw new TypeError()

        // load it into the loader and play it
        this.htmlAudio.src = song.filename
        this.htmlAudio.play()
    },

    /** Pause song */
    pause: () => {
        this.htmlAudio.pause()
    },

    /**
     * 
     * @param {String} ref Reference to song
    */
    getSong: ref => {
        // check if reference
        if (typeof ref !== 'string' || !ref.startsWith(this.refID()))
            return undefined

        // load the song to fetch metadata
        let filename = ref.substring(ref.indexOf(':'))
        let songBuffer = fs.readFileSync(filename)
        let id3Meta = id3.parse(songBuffer)
        if (id3Meta == false) throw new Error("ID3 parser couldn't read tags")

        // return song information
        return {
            /** Song author */
            author: id3Meta.artist,

            /** Song title */
            title: id3Meta.title,

            /** Song reference */
            ref,

            /** Player core */
            core: this,

            /** Song filename */
            filename
        }
    },

    /** Called by the player system when the core is registered */
    register: (player, events) => {
        // criss-cross events between the HTMLAudio API and player system

        // play next song when this one ends
        this.htmlAudio.addEventListener('ended', () => player.next())
    }
}

module.exports = htmlCore
