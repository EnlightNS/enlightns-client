//get common config
var remote = require('remote');

var config = remote.require('config');

var utils = require('./js/utils');

var async = require('async');



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
    async.series([
        function(callback) {
            async.parallel([
                //Load posts
                function(callback) {
                    if (!isLoggedIn) {
                        var apiHost = config.get('Api.auth.host');
                        var apiEndPoint = config.get('Api.auth.endpoint');
                        var apiReqMethod = config.get('Api.auth.method');

                        //console.log("Vals:", apiHost, apiEndPoint, apiReqMethod);
                        //send post request
                        utils.performRequest(apiHost, customHeader, apiEndPoint, apiReqMethod,
                            {
                                email: login.value,
                                password: pass.value
                            },
                            function (err, data) {
                                if (err) {
                                    console.log("Request process error:", err);
                                }
                                console.log('Logged in:', configObj, data);
                                if (typeof configObj != undefined && configObj && configObj.hasOwnProperty('token')) {
                                    isLoggedIn = true;
                                    console.log("Token Retrieved!!!");
                                    authKey = configObj.token;

                                } else {
                                    console.log("Improper Credentials");
                                }
                                utils.writeConfig(config_file, data);
                                console.log("Write done!!!");
                                callback();

                            }
                        );


                    }
                },
                //Load photos
                function(callback) {
                    console.log("was here!!!");
                }
            ], callback);
        }
    ], function(err) {
        if (err){
            console.log("An error happened", err);
        }
    });

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