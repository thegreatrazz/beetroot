/// <reference path="../script.js">

//
// Beetroot Internationalisation (nailed it)
//
// This is the module that handles things relating to language
// an software localisation. It handles the "data-i18n-string" HTML attribute
// and provides methods for the string of a specific language.
//

/**
 * Internationalisation
 */
var i18n = {
    /**
     * Language ID (defaults to _English, United States_)
     */
    lang: "en-US",

    /**
     * Language data
     */
    langData: { },

    /**
     * Get a list of available languages
     */
    getLanguages: function()
    {
        // Get a list of file names
        var fnames = fs.readdirSync(path.join(__dirname, "i18n"))
        var langList = [];

        // Filter the files and get the languages
        for (var i = 0; i < fnames.length; i++)
        {
            // Get a variable we can work on
            var filename = fnames[i]

            // Check the file declares itself as a JSON
            var ext = filename.substring(filename.lastIndexOf('.') + 1)
            if (ext !== "json") continue  // If it doesn't, skip
            
            // Load up the file
            var fileData = fs.readFileSync(path.join(__dirname, "i18n", filename),
                                                     { encoding: "utf8" })
            
            // Try to get the pretty name and author without crashing
            var langName, langAuthor, langJson
            try
            {
                // Load the json
                langJson = JSON.parse(fileData)

                // Read name and author
                langName = langJson.prettyName
                langAuthor = langJson.author
            }
            catch (ex)
            {
                // If this a syntax error, skip
                if (ex instanceof SyntaxError)
                    continue
                // Otherwise throw again
                else throw ex
            }

            // Add the language to the list, stripping the ext
            langList.push({ id: path.basename(fnames[i], ".json"),
                            name: langJson.prettyName,
                            author: langJson.author })
        }

        return langList
    },

    getLanguageData: function(lang)
    {
        // Check if the language is available
        if (!fs.existsSync(path.join(__dirname, "i18n", lang + ".json")))
        throw "Language not available";

        // Read the language data
        var langStr = fs.readFileSync(path.join(__dirname, "i18n", lang + ".json"))
        var langObj = JSON.parse(langStr)

        // Return to caller
        return langObj
    },

    /**
     * Sets the user interface language
     */
    setLanguage: function(lang)
    {
        // Get the language data
        var data = i18n.getLanguageData(lang)

        // Set the language
        i18n.lang = lang
        i18n.langData = data

        // Look for strings needed to be changed
        $("[data-i18n-string]").each((i, e) =>
        {
            // For each, look for the ID and apply
            $(e).html(i18n.getString($(e).data("i18n-string")))
        })
    },

    /**
     * Gets localised string
     */
    getString: function(id, lang = i18n.lang)
    {
        return i18n.langData.body[id]
    },
}

i18n.setLanguage(i18n.lang)
