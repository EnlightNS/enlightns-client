//get common config
var remote = require('remote');

var config = remote.require('config');

var utils = require('./js/utils');

var async = require('async');

var request = require('sync-request');

var querystring = require('querystring');



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
    var isLoggedIn = false;
    var writeConfig = false;
    var authKey = "";
    var customHeader = {};
    data = {};
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
            },
            function(config_written, callback) { // write config file if user logged in for the first time
                // console.log("Checking if logged in");
                var showRecords = false;
                if (true) {
                    console.log("temptations");
                };
                callback(null, config_written);
            },

        ],
        function(err, result) {
            if (err) {
                console.log("An error happened", err);
            }
        }
    );

    //
    // callback(null);
    // async.series([
    //     function(callback) {
    //         async.waterfall([
    //             //Load posts
    //             function(callback) {
    //                 if (!isLoggedIn) {
    //                     var apiHost = config.get('Api.auth.host');
    //                     var apiEndPoint = config.get('Api.auth.endpoint');
    //                     var apiReqMethod = config.get('Api.auth.method');
    //
    //                     //console.log("Vals:", apiHost, apiEndPoint, apiReqMethod);
    //                     //send post request
    //                     var dataString = utils.performRequest(apiHost, customHeader, apiEndPoint, apiReqMethod,
    //                         {
    //                             email: login.value,
    //                             password: pass.value
    //                         });
    //                         // function (err, data) {
    //                         //     if (err) {
    //                         //         console.log("Request process error:", err);
    //                         //     }
    //                         //     console.log('Logged in:', configObj, data);
    //                         //     if (typeof configObj != undefined && configObj && configObj.hasOwnProperty('token')) {
    //                         //         isLoggedIn = true;
    //                         //         console.log("Token Retrieved!!!");
    //                         //         authKey = configObj.token;
    //                         //
    //                         //     } else {
    //                         //         console.log("Improper Credentials");
    //                         //     }
    //                         //     utils.writeConfig(config_file, data);
    //                         //     console.log("Write done!!!");
    //                         //
    //                         //
    //                         // }
    //                     // );
    //                     callback(null, dataString);
    //
    //                 }
    //             },
    //             //Load photos
    //             function(dataString, acallback) {
    //                 console.log("was here!!!", dataString);
    //             }
    //         ], callback);
    //     }
    // ], function(err) {
    //     if (err){
    //         console.log("An error happened", err);
    //     }
    // });

    //console.log("2 ", isLoggedIn, configObj);


    //} else {
    //    //console.log(configObj);
    //    console.log("Already Logged in");
    //    if (authKey){
    //        customHeader ={
    //            "Authorization": authKey
    //        };
    //        var apiRecordHost = config.get('Api.record_list.host');
    //        var apiRecordEndPoint = config.get('Api.record_list.endpoint');
    //        var apiRecordReqMethod = config.get('Api.record_list.method');
    //        utils.performRequest( apiRecordHost, customHeader, apiRecordEndPoint, apiRecordReqMethod,
    //            {},
    //            function(err, data) {
    //                if (err) {
    //                    console.log("Request process error:", err);
    //                }
    //                console.log('Record List:', data);
    //            }
    //        );
    //
    //    }
    //}




});
