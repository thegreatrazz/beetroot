
var path = require("path")
var { app, BrowserWindow, ipcMain, dialog } = require("electron")

var win

function createWindow()
{
    win = new BrowserWindow({
        width: 360, height: 500,
        useContentSize: true,
        minWidth: 360, maxWidth: 360,
        titleBarStyle: "hiddenInset"
    })

    win.loadFile(path.join(__dirname, "app", "index.html"))

    win.webContents.openDevTools({ mode: "detach" })
}

app.on("ready", createWindow)

ipcMain.on("open-dialog", (event, arg) =>
{
    dialog.showOpenDialog(win, arg, paths =>
    {
        event.sender.send(JSON.stringify(paths))
    })
})
