
var path = require("path")
var { app, BrowserWindow } = require("electron")

var win

function createWindow()
{
    win = new BrowserWindow({
        width: 360, height: 500,
        useContentSize: true,
        minWidth: 360, maxWidth: 360
    })

    win.loadFile(path.join(__dirname, "app", "index.html"))

    win.webContents.openDevTools({ mode: "detach" })
}

app.on("ready", createWindow)