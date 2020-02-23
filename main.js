const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;
const fs = require('fs');
const wav = require('node-wav');
const Speaker = require('speaker');

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

ipc.handle('filenames', (async (event, args) => {
    return fs.readdirSync("resources/audio");
}));

const speaker = new Speaker({
    channels: 2,
    bitDepth: 32,
    sampleRate: 44100,
    float: true,
});

ipc.on("play", (event, args) => {
    console.log("playing " + args);
    let sound = fs.readFileSync("resources/audio/" + args + ".wav");
    let result = wav.decode(sound);
    let interlaced = [];
    for (let i = 0; i < result.channelData[0].length; i++) {
        interlaced.push(result.channelData[0][i], result.channelData[1][i]);
    }
    speaker.write(Buffer.from(Float32Array.from(interlaced).buffer));
});