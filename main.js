/**
 * Created by syawar on 26/12/15.
 */
var app = require('app');

var BrowserWindow = require('browser-window');

const ipcMain = require('electron').ipcMain;


var mainWindow = null;

app.on('ready', function(){

    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        icon: __dirname + '/app/img/logo.png'
    });

    // load the index.html
    mainWindow.loadURL('file:///' + __dirname + '/app/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

});

ipcMain.on('synchronous-message', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.returnValue = 'pong';
  //load
  mainWindow.loadURL('file:///' + __dirname + '/app/ind2.html');
});
