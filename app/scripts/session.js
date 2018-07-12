
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
    },
    ui: {
        language: "en-US"
    }
}

/**
 * Object to prevent messing up the window
 */
var sessionMgr = {
    // This is where things go
    settings: {
        /**
         * Gets the setting value for the key
         */
        get: function(key)
        {
            // The key should is a string
            if (typeof key !== "string")
                throw "'key' is not a string.";

            // Separate the key into objects
            var keySections = key.split(".")
            var iterObject = config  // The object we're looking for, start with config
            
            // For every dot, we need to access that index of an array
            keySections.forEach((section) =>
            {
                iterObject = iterObject[section]
            })

            // TODO: Fire the hooks listening on this

            // Return the object we were looking for
            return iterObject
        },

        /**
         * 
         */
        set: function(key, content)
        {
            /// PRE-FLIGHT CHECKS ///

            // The key should be a string
            if (typeof key !== "string")
                throw "'key' is not a string."

            // The content should be defined
            if (typeof content === "undefined")
                throw "'content' is undefined."

            /// ACTION ///

            // This is mostly the same code as in get()

            // Seperate key into objects
            var keySections = key.split(".")
            var iterObject = config

            // !! TODO: Find a better, more efficient way to do this

            // For every dot, we need to access that index of an array
            for (var i = 0; i < keySections.length; i++)
            {
                // I opted for the classical "for" loop since we need to stop right
                // before the last one.
                
                // The last one needs to be applied specially
                if (i === keySections.length - 1)
                {
                    // This need to be applied as an object
                    iterObject[keySections[i]] = content

                    // This is done
                    continue
                }

                // Else, do what we did before
                iterObject = iterObject[keySections[i]]
            }

            // With the final interation object, set it
            iterObject = content

            /// HOOKS ///

            // Call the hooks interested
            sessionMgr.settings.hooks.forEach((hook) => {
                // The whole method shouldn't go down altogether
                // just because something fell of the hook (aka exceptions)
                try
                {
                    // Pass the key and content to the hook
                    hook(key, content)
                }
                catch (ex)
                {
                    // We can log the error just in case
                    console.error("Exception Occurred. " + ex)
                }
            })

        },

        /**
         * Flushes the configuration to hard drive
         */
        flush: function() 
        {
            console.warn("Not implemented.")
        },

        /**
         * Hooks for the set() method
         */
        hooks: [ function(key, content) {
            console.log(`Demo hook.\n\nKey: ${key}\nContent: ${content}`)
        } ]
    }
}