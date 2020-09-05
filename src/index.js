import { app, BrowserWindow, screen } from 'electron';

const fileSystem = require("fs");
const {ipcMain} = require('electron');

let config = JSON.parse(fileSystem.readFileSync(__dirname+"\\config.json"));

let width = config.width;
let height = config.height;

let posX = config.x;
let posY = config.y;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let displays;

const createWindow = () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    transparent:true,
    webPreferences:{
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools({mode:'undocked'});

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  setTimeout(createWindow, 100);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('adjust-window-size', (event, data) => {
  if(data.width > config.width || data.height > config.height){

    if(data.width > config.width){
      config.width = data.width;
    }

    if(data.height > config.height){
      config.height = data.height;
    }

    let configString = JSON.stringify(config);
    fileSystem.writeFileSync(__dirname+"\\config.json",configString);

    mainWindow.setSize(config.width, config.height);

  }
});

setTimeout(function(){
  mainWindow.setPosition(posX, posY);
  displays = screen.getAllDisplays();
},200);

ipcMain.on('set-window-position', (event, data) => {
  let position = mainWindow.getPosition();

  let currentPosX = position[0];
  let currentPosY = position[1];

  if(posX != currentPosX || posY != currentPosY){
    config.x = currentPosY;
    config.y = currentPosY;

    let configString = JSON.stringify(config);
    fileSystem.writeFileSync(__dirname+"\\config.json",configString);
  }
});

ipcMain.on('get-displays-count', (event, data) => {
  event.sender.send("display-count", displays.length); 
})

