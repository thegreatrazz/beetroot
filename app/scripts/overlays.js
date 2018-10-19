/// <reference path="../script.js">

const $ = require("jquery")

/**
 * Overlays object
 */
var overlays = {
    /**
     * Overlay cloak
     */
    cloak: document.querySelector("body > .overlays"),

    /**
     * Displays overlay
     */
    showOverlay: function(overlay)
    {
        // Get the overlay element
        var overlay = document.getElementById(overlay)

        // Make sure the element is indeed an overlay
        if (!overlay.parentElement.classList.contains("overlays"))
            throw "Element ID specified is not an overlay.";

        // Now that we know the overlay is real, show it
        overlay.classList.add("active")
        overlay.parentElement.classList.add("active")
    },

    /**
     * Hides overlay
     */
    hideOverlay: function()
    {
        // Fade this out
        var overlayContainer = document.querySelector("body > .overlays")
        setTimeout(overlayContainer.classList.remove("active"), 400)

        // Dismiss all overlays
        var overlays = document.querySelectorAll("body > .overlays > *")
        overlays.forEach(function(el)
        {
            el.classList.remove("active")
        })
    }
}

// Also 
document.querySelector("body > .overlays > .overlay-cloak").addEventListener("click", overlays.hideOverlay)

// Events
$("[data-overlay]").click(function()
{
    overlays.showOverlay($(this).attr("data-overlay"))
})

module.exports = overlays
