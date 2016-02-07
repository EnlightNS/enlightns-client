/**
 * Created by syawar on 26/12/15.
 */
var app = require('app');

const BrowserWindow = require('electron').BrowserWindow;

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

    ipcMain.on('sync-records', function(event, arg) {
      console.log(arg);
      // load the index.html
      var recordWindow = new BrowserWindow({
          width:800,
          height:600,
          icon: __dirname + '/app/img/logo.png'
      });

      // load the index.html
      recordWindow.loadURL('file:///' + __dirname + '/app/ind2.html');
      event.returnValue = recordWindow;


    });


});
