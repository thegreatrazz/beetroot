
// File system
var fs = require("fs")
var path = require("path")

// Electron
var electron = require("electron")
var { ipcRenderer } = electron

// jQuery is love, jQuery is life
var jQuery = require("jquery")
var $ = jQuery

// TODO: Modularise some components
const settings = require("./scripts/settings")
const i18n = require("./scripts/i18n")
const library = require("./scripts/library")
const overlays = require("./scripts/overlays")

// If we're running on a Mac, get rid of "Now Playing"
if (process.platform === "darwin")
    $(".player-status").remove()
