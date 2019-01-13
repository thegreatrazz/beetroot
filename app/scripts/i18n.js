/// <reference path="../script.js">

//
// Beetroot Internationalisation (nailed it)
//
// This is the module that handles things relating to language
// an software localisation. It handles the "data-i18n-string" HTML attribute
// and provides methods for the string of a specific language.
//

const fs = require("fs")
const path = require("path")
const $ = require("jquery")

/**
 * Internationalisation
 */
var i18n = {
    /**
     * Language ID (defaults to _English, United States_)
     */
    lang: "en-US",

    /**
     * Language to fall back on if a string is not found
     */
    langFallback: "en-US",

    /**
     * Language data
     */
    langData: { },

    /**
     * Language folder
     */
    langFolder: path.join(__dirname, "..", "i18n"),

    /**
     * Get a list of available languages
     */
    getLanguages: function()
    {
        // Get a list of file names
        var fnames = fs.readdirSync(i18n.langFolder)
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
            // TODO: Find a Node-less way of retrieving the file.
            //       hook into external function?
            var fileData = fs.readFileSync(path.join(i18n.langFolder, filename),
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
        if (!fs.existsSync(path.join(i18n.langFolder, lang + ".json")))
            throw `Language "${lang}" not available`;

        // Read the language data
        var langStr = fs.readFileSync(path.join(i18n.langFolder, lang + ".json"))
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

        // Set the author
        $("[data-i18n-author]").html(i18n.langData.author)

        // Look for strings needed to be changed
        $("[data-i18n-string]").each((i, e) =>
        {
            // Get string to show
            let string = i18n.getString($(e).attr("data-i18n-string"))

            // If the strings want us to update an attribute, do that
            console.log($(e).attr("data-i18n-attr") !== undefined)
            if ($(e).attr("data-i18n-attr") !== undefined)
                $(e).attr($(e).attr("data-i18n-attr"), string)
            else
                $(e).html(string)
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

// Load the default language before moving on
i18n.setLanguage(i18n.lang)

// Load the languages into the language list
i18n.getLanguages().forEach((lang, i) =>
{
    // Load the ui.language data toggle
    let el = $("[data-toggle=\"ui.language\"]")

    // Create an option element
    let opt = $("<option />")
    opt.attr("value", lang.id)
    opt.html(lang.name)

    // Insert the language
    opt.appendTo(el)

    // If the current language is selected, load that.
    if (i18n.lang == lang.id)
        el.each((ix, el) => { el.selectedIndex = i })
})

module.exports = i18n
