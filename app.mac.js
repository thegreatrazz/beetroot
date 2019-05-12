
/**
 * Mac OS X support file
 * 
 * macOS is a bit special as in it has a static menu bar. This file provides
 * functionality that macOS supports, but is not needed for Windows or Linux.
 * 
 */

let macApp = {

}

/**
 * A quasi-contructor for this module
 * @argument {Electron.App} app 
 * @argument {Electron.BrowserWindow} window
 */
module.exports = function(app, window) {
    // Add event handlers

    // Insert menu bar

    // Return the object like a good constructor
    return macApp
}
