
/*
 * Beetroot DJ Panel - Rendering Process
 *
 * This is the main file which the HTML page calls upon.
 * It's responsible for including and setting up the the page and it's dependents.
 * 
 */

//** COMPONENTS **///

// Beetroot components
const settings = require("./scripts/settings")
const i18n = require("./scripts/i18n")
const library = require("./scripts/library")
const overlays = require("./scripts/overlays")

//** COMPONENT HOOKS **//

// If we're running on a Mac, get rid of "Now Playing"
if (process.platform === "darwin")
    $(".player-status span").remove()

// Hook into the setting of ui.language
settings.hooks.push((key, content) =>
{
    // Don't do anythign if this not out key
    if (key !== "ui.language")
        return

    // Ok it is... Set the new language
    i18n.setLanguage(content)
})

//** INITIALISATION **//

// Update the music files
library.updateMusicFiles()
