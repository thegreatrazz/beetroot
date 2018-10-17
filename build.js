#!/usr/bin/env node

const fs = require("fs")
const url = require("url")
const path = require("path")
const packager = require("electron-packager")

packager({
    dir: __dirname,
    asar: true,
    executableName: "beetroot-next",
    name: "Beetroot Player",
    out: "out",
    overwrite: true,

    // Target platforms
    platform: "win32,linux,darwin",
    arch: "x64",

    // Windows metadata
    win32metadata: {
        CompanyName: "Raresh Nistor (thegreatrazz)",
        ProductName: "Beetroot",
        FileDescription: "Media Player with Guest Queueing Capabilities.",
        InternalName: "beetroot-desktop",
        "requested-execution-level": "asInvoker"
    },

    // macOS App Type
    appCategoryType: "public.app-category.music"
})
.then(appPaths =>
{
    console.log(appPaths)
})