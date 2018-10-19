
const fg = require("fast-glob")

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
        sessionMgr.settings.get("library.localFolders").forEach(val =>
        {
            fg(library.supportedMediaGlobs, { cwd: val, unique: true, absolute: true })
                .then(paths => { paths.forEach(path => mediaFilenames.push(path)) })
                .catch(reason => { error = reason })
        })

        callback(mediaFilenames, error)
    }
}

module.exports = library
