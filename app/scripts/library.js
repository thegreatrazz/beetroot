
const fg = require("fast-glob")
const $ = require("jquery")

var library = {
    songs: [{
        path: "C:\\music.mp3"
    }],
    supportedMediaGlobs: [
        "**/*.ogg",     // OGG (no comment)
        "**/*.mp3",     // MP3 (lame)
        "**/*.wav",     // Windows WAV
        "**/*.flac",    // The fucking lazy audiophile's codec
        "**/*.wma"      // Windows Media Audio
    ],
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

        callback(mediaFilenames, error)
    },
    updateMusicFiles: function()
    {
        updateMediaFoldersUI()
    }
}

var internalEvents = {
    localPathDelete: function()
    {
        var localFolders = settings.get("library.localFolders")
        var index = localFolders.indexOf($(this).siblings(".source-path").text())
        if (index !== -1) localFolders.splice(index, 1)
        settings.set("library.localFolders", localFolders)

        library.updateMusicFiles()
    }
}

function updateMediaFoldersUI() {
    // First clear out existing folders
    $("#local-source-cfg").children().remove()

    // And create new ones
    settings.get("library.localFolders").forEach(folder =>
    {
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

module.exports = library
