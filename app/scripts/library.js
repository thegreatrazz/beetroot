
const { remote } = require("electron")
const fg = require("fast-glob")
const $ = require("jquery")

var library = {
    // NOTE: the songs parameter wasn't used to begin with

    /**
     * These are the currently supported media files (hope codecs are installed
     * and that 😅)
     */
    supportedMediaGlobs: [
        "**/*.ogg",     // OGG (no comment)
        "**/*.mp3",     // MP3 (lame)
        "**/*.wav",     // Windows WAV
        "**/*.flac",    // The ****ing lazy audiophile's codec
        "**/*.wma"      // Windows Media Audio
    ],

    /**
     * Goes through the folders defined in settings and returns (or callbacks
     * for async) a list of filenames.
     */
    getMusicFiles: (callback) =>
    {
        var mediaFilenames = [ ]
        var error = undefined

        // Look through the different library folders
        settings.get("library.localFolders").forEach(val =>
        {
            fg(library.supportedMediaGlobs, { cwd: val, unique: true, absolute: true })
                .then(paths => { paths.forEach(path => mediaFilenames.push(path)) })
                .catch(reason => { error = reason })
        })

        if (typeof callback === "function")
            callback(mediaFilenames, error)

        return mediaFilenames
    },

    /**
     * Updates other modules on music file status
     */
    updateMusicFiles: function()
    {
        updateMediaFoldersUI()
    }
}

var internalEvents = {
    localPathDelete: function()
    {
        // This function is marked for re-factoring

        var localFolders = settings.get("library.localFolders")
        var index = localFolders.indexOf($(this).siblings(".source-path").text())
        if (index !== -1) localFolders.splice(index, 1)
        settings.set("library.localFolders", localFolders)

        library.updateMusicFiles()
    },
    addFolder: function() {
        // This function is marked for refactoring

        remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            title: "Add new folder to library",
            properties: ['openDirectory', 'multiSelections']
        }, filePaths => {
            if (filePaths == undefined) return

            filePaths.forEach(val =>
                settings.get("library.localFolders").push(val)
            )

            library.updateMusicFiles()
        })
    }
}

function updateMediaFoldersUI() {
    // This function is marked for refactoring

    // First clear out existing folders
    $("#local-source-cfg").children().remove()

    // And create new ones
    settings.get("library.localFolders").forEach(folder =>
    {
        // Shorten the path if this is inside our home folder
        folder = folder.replace(process.env["HOME"], "~")

        // <li>
        //     <i class="fas fa-fw fa-folder"></i>
        //     <div class="source-path">C:\Users\rareshn\Music</div>
        //     <a href="#" title="Remove"><i class="fas fa-fw fa-times"></i></a>
        // </li>
        let element = $("<li><i class='fas fa-fw fa-folder' /><div class='source-path' /><a href=#><i class='fas fa-fw fa-times' /></a></li>")
        element.children(".source-path").html(folder)
        element.children("a").on("click", internalEvents.localPathDelete)
        element.appendTo("#local-source-cfg")
    })
}

// Hook event for adding folders
//      This function is marked for refactoring
$("#librarycfg > a:nth-child(4)").click(internalEvents.addFolder)

module.exports = library
