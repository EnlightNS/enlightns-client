/**
 * Created by syawar on 26/12/15.
 */
var app = require('electron').app;
const ipcMain = require('electron').ipcMain;

var BrowserWindow = require('electron').BrowserWindow;

//main window vairable
var mainWindow = null;

app.on('ready', function(){

    //create the browser window
    var mainWindow = new BrowserWindow({
        width:800,
        height:600,
        icon: __dirname + '/app/img/logo.png'
    });

    // load the index.html
    mainWindow.loadURL('file:///' + __dirname + '/app/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    //create records windows

    ipcMain.on("show-records", function(event, arg){
        console.log("recieved data:", arg);
        mainWindow.loadURL('file:///' + __dirname + '/app/records_list.html');
        event.returnValue = 'pong';
    });

});

