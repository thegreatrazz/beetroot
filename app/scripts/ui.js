/**
 * Beetroot UI
 * 
 * This module is meant to glue the different modules to the user interface
 * rather than having a huge spagetti mess in each module.
 * 
 * While the initialisation code for the modules are in script.js, this module
 * will connect the UI to the backend.
 * 
 * It will be inserted into regular JS after script.js.
 */

// macOS doesn't need window controls
if (process.platform === "darwin") {
    $("#titlebar-controls [data-window-action]").remove()
}

// Window Controls
$("[data-window-action]").click(ev => {
    console.log(ev.currentTarget)

    switch ($(ev.currentTarget).attr("data-window-action")) {
        case "minimize":
            electron.getCurrentWindow().minimize()
            break

        case "close":
            // Closing protocol, do properly later
            electron.getCurrentWindow().close()
            break
    }
})