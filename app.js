var path = require("path");
var { app, BrowserWindow } = require("electron");

var debug = process.argv.indexOf("--debug-mode") > -1;
var win;

function createWindow() {
    // Core options for browser window
    let browserWindowOpts = {
        width: 360,
        height: 500,
        useContentSize: true,
        minWidth: 360,
        maxWidth: 360,
        fullscreenable: false,
        maximizable: false,
        show: debug
    };

    switch (process.platform) {
        case "win32":
            console.log("Hello Windows users!");

            // Windows has a custom titlebar ready to go!
            browserWindowOpts["frame"] = false;

            break;

        case "darwin":
            console.log("Hello macOS (Darwin) users!");

            // macOS also has a titlebar style
            browserWindowOpts["titleBarStyle"] = "hidden";

            break;

        case "linux":
            console.log("Hello Linux users! May the command-line be with you.");

            // X11 has a bit of trouble limiting only the vertical axis
            browserWindowOpts["maxWidth"] = undefined;
            browserWindowOpts["minWidth"] = undefined;

            break;

        default:
            console.log(
                "Hi there. You're running beetroot on an unsupported platform."
            );
            console.log("If you've got any issues, report them to GitHub.");
            break;
    }

    win = new BrowserWindow(browserWindowOpts);
    win.setMenu(null); // We don't need menus!

    win.loadFile(path.join(__dirname, "app", "index.html"));

    if (debug) win.webContents.openDevTools({ mode: "detach" });

    win.on("ready-to-show", () => {
        win.show();
    });
}

app.on("ready", createWindow);
