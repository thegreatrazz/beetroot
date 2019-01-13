
// Node modules
const fs = require("fs")
const { parse } = require("id3-parser")
const fileUrl = require("file-url")

// Events
const EventEmitter = require("events")
let events = new EventEmitter()

// Playlist variables

/**
 * Playlist for the player
 */
let playlist = []
// NOTE TO SELF: Don't be an idiot and SET the variable from outside.
// Use the prototype methods, you numbnut.

/**
 * Currently playing index in playlist
 */
let playlistIndex = -1

// Random option variables

/**
 * Whether to pick random elements from the playlist
 */
let random = false

/**
 * The algorithm to user for randomisation
 * 
 * * "smart" - Picks a song that hasn't been played in this cycle.
 * * "dumb" - Just pick a number at random and play 
 */
let randomAlgo = "smart"

// HTML audio interface

/**
 * HTMLAudioElement interface
 */
let audioInterface = new Audio()

// Public functions

/**
 * Plays a song in the playlist
 */
function play(index = this.playlistIndex) {
    if (typeof index === "number") {
        if (!this.audioInterface.paused)
            this.audioInterface.pause()

        this.audioInterface.src = this.playlist[index]
        this.audioInterface.play()
        this.playlistIndex = index

        let id3Meta

        try {
            id3Meta = this.getMetadata()
        } catch (ex) {
            throw ex
        }

        events.emit("play", id3Meta)
    } else {
        // EH...
    }
}

/**
 * Resumes a song if it's been paused
 */
function resume() {
    // Un-pause the song
    if (this.audioInterface.paused)
        this.audioInterface.play()
    this.events.emit("resume")
}

/**
 * Pauses the currently playing song
 */
function pause() {
    // Pause the song
    if (!this.audioInterface.paused)
        this.audioInterface.pause()
    this.events.emit("pause")
}

/**
 * Skip the currently playing song
 */
function skip() {
    // Up the index count
    this.playlistIndex++
}

/**
 * Replays the currently playing song
 */
function replay() {
    // Set the current time to 0
    this.audioInterface.currentTime = 0
}

/**
 * Goes to the previous song
 */
function back() {
    // Down the index count
    this.playlistIndex--
}

function getMetadata(index = this.playlistIndex) {
    // Load the path to this song
    let songBuffer = fs.readFileSync(this.playlist[index])

    // Extract those magical things?
    let id3Meta = parse(songBuffer)

    if (id3Meta === false)
        throw new Error("ID3 parser couldn't find ID3 tags.")

    return id3Meta
}

/**
 * Did I win?
 */
module.exports = {
    playlist, playlistIndex,
    random, randomAlgo,
    audioInterface, getMetadata, events,
    play, pause, skip, replay, back
}
