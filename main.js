/**
 * Created by syawar on 26/12/15.
 */
var app = require('app');

var BrowserWindow = require('browser-window');

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
    // mainWindow.webContents.openDevTools();

});

