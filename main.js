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

    //load records window
    ipcMain.on('sync-records', function(event, arg) {
        console.log(arg);
        // load the records window
        var recordWindow = new BrowserWindow({
            width:800,
            height:600,
            icon: __dirname + '/app/img/logo.png'
        });

        //load the DevTools
        recordWindow.webContents.openDevTools();

        // load the index.html
        recordWindow.loadURL('file:///' + __dirname + '/app/records.html');
        event.returnValue = recordWindow;
    });



});
