//get common config

const ipcRenderer = require('electron').ipcRenderer;
var BrowserWindow = require('electron').remote.BrowserWindow;
var remote = require('remote');

var config = remote.require('config');

var utils = require('./js/utils');




//form event listener
var form = document.querySelector('form');
form.addEventListener('submit', function(ev) {

    //get form data
    var login = form.querySelector('input[name="login"]');
    var pass = form.querySelector('input[name="password"]');

    //console.log(login.value, pass.value);

    var config_file = __dirname + config.get("Config.filename");
    var configObj = utils.readConfig(config_file);
    var isLoggedIn = false;
    var authKey = "";
    var customHeader = {};
    //console.log("1", isLoggedIn, configObj);

    if ( configObj ){
        if ( configObj.hasOwnProperty('token') ){
            isLoggedIn = true;
            console.log("Token Exists!!!");
            authKey = configObj.token;
        }
    }

    //console.log("2 ", isLoggedIn, configObj);

    if (!isLoggedIn){
        var apiHost = config.get('Api.auth.host');
        var apiEndPoint = config.get('Api.auth.endpoint');
        var apiReqMethod = config.get('Api.auth.method');

        //console.log("Vals:", apiHost, apiEndPoint, apiReqMethod);
        //send post request
        utils.performRequest( apiHost, customHeader, apiEndPoint, apiReqMethod,
            {
                email: login.value,
                password: pass.value
            },
            function(err, data) {
                if (err) {
                    console.log("Request process error:", err);
                }
                console.log('Logged in:', configObj, data);
                if ( configObj.hasOwnProperty('token') ){
                    isLoggedIn = true;
                    console.log("Token Retrieved!!!");
                    authKey = configObj.token;
                }
                utils.writeConfig(config_file, data);
            }
        );

        console.log("Write done!!!");
    } else {
        //console.log(configObj);
        console.log("Already Logged in");
    }

    if (isLoggedIn && authKey){
        console.log("Starting records!!!");
        //add the jwt authorization
        customHeader ={
            "Authorization": authKey
        };

        //get the proper config
        var apiRecordHost = config.get('Api.record_list.host');
        var apiRecordEndPoint = config.get('Api.record_list.endpoint');
        var apiRecordReqMethod = config.get('Api.record_list.method');

        //http request
        utils.performRequest( apiRecordHost, customHeader, apiRecordEndPoint, apiRecordReqMethod,
            {},
            function(err, data) {
                if (err) {
                    console.log("Request process error:", err);
                }
                console.log('Record List:', data);
                //console.log(ipcRenderer.sendSync("show-records", data));

            }
        );

    }


});