//get common config
var remote = require('remote');

var config = remote.require('config');

var utils = require('./js/utils');

var async = require('async');

var request = require('sync-request');

var querystring = require('querystring');

const ipcRenderer = require('electron').ipcRenderer;


var isLoggedIn = false;

//form event listener
var form = document.querySelector('form');
form.addEventListener('submit', function(ev) {

    //get form data
    var login = form.querySelector('input[name="login"]');
    var pass = form.querySelector('input[name="password"]');

    //console.log(login.value, pass.value);

    var config_file = __dirname + config.get("Config.filename");
    var configObj = "";
    utils.readConfig(config_file, function(err, configRet) {
        if (err) {
            console.log("config read error");
        }
        configObj = configRet;
    });

    var writeConfig = false;
    var authKey = "";
    var customHeader = {};
    var data = {};
    //console.log("1", isLoggedIn, configObj);

    if (configObj) {
        if (configObj.hasOwnProperty('token')) {
            isLoggedIn = true;
            console.log("Token Exists!!!");
            authKey = configObj.token;
        }
    }
    async.waterfall([
            function(callback) { //if user is not logged in, check config to login
                var token = "";
                if (!isLoggedIn) {
                    var apiHost = config.get('Api.auth.host');
                    var apiEndPoint = config.get('Api.auth.endpoint');
                    var apiReqMethod = config.get('Api.auth.method');
                    var apiReqURL = config.get('Api.auth.URL');
                    var dataString = JSON.stringify(data);
                    var headers = {};

                    data = {
                        email: login.value,
                        password: pass.value
                    };

                    headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': dataString.length
                    };

                    //perfrom request
                    var res = request(apiReqMethod, apiReqURL, {
                        json: data
                    }, function(err) {
                        if (err) {
                            callback(err);
                        }
                    });

                    token = JSON.parse(res.getBody('utf8'));
                    writeConfig = true;


                }
                callback(null, token);

            },
            function(token, callback) { // write config file if user logged in for the first time
                // console.log("was here!!!", token);
                var config_written = false;
                if (!isLoggedIn && writeConfig) {
                    utils.writeConfig(config_file, token, function(err, written) {
                        if (err) {
                            console.log("config write error");
                            callback(err);
                        }
                        config_written = written;
                    });
                }
                console.log("config write:", config_file);
                callback(null, config_written);
            }

        ],
        function(err, result) {
            if (err) {
                console.log("An error happened", err);
            }
        }
    );

    if (authKey){
           var data = {};
           var apiRecordHost = config.get('Api.record_list.host');
           var apiRecordEndPoint = config.get('Api.record_list.endpoint');
           var apiRecordReqMethod = config.get('Api.record_list.method');
           var apiRecordReqURL = config.get('Api.record_list.URL');
           var dataString = JSON.stringify(data);


           async.waterfall([
                function(callback){
                    //perfrom request
                    console.log("Testing ... ", apiRecordReqMethod, apiRecordReqURL);
                    var res = request(apiRecordReqMethod, apiRecordReqURL, {
                        "headers": {
                            "Authorization": authKey
                        }
                    }, function(err) {
                        if (err) {
                            callback(err);
                        }
                    });


                    records_list = JSON.parse(res.getBody('utf8'));

                    console.log("List of records:", JSON.stringify(records_list, null, 2));

                    callback(null, records_list);
                },
                function(record_list, callback){
                    console.log("Logged IN!!!");
                    console.log(ipcRenderer.sendSync('synchronous-message', 'ping'));
                }
            ],
               function(err, result) {
                   if (err) {
                       console.log("An error happened while reading"+
                       " the record list", err);
                   }
               }
           );



     }


});
