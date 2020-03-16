const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;
const fs = require('fs');

async function createWindow () {
   let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

   await win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipc.handle('filenames', (async () => {
    return fs.readdirSync("resources/audio");
}));