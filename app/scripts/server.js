
const settings = require("./settings")

getServerPath = apiFunction => settings.get("requests.serverUrl").replace("$", apiFunction)

let server = {
    /**
     * Checks and syncs this client to the request service
     */
    conferSession: function() {
        getServerPath("session")
    },

    pushAppInfo: function() {
    },
    pushSettings: function() {
    },
    pushLibrary: function() {
    },
    getRequests: function() {
    }
}

module.exports = server
