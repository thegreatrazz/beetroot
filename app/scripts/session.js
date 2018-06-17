
//
// Beetroot Session Manager
// 
// This is the code that creates, manages, saves, 
// and handles the behind the scenes triggers and variables for Beetroot
//

/**
 * Configuration, do not change variables directly
 */
var config = {
    // This is the configuration
    song: {
        repeat: true  // Plays songs "smart-randomly"
    },
    requests: {
        enabled: false,
        serverSession: "a-completely-random-guid-used-for-client-verification",
        serverId: "a-6-character-hex",
        serverUrl: "https://beets.thegreatrazz.nz/$"
    }
}

/**
 * Object to prevent messing up the window
 */
var sessionMgr = {
    // This is where things go
}