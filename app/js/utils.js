
//load the main process
var remote = require('remote');

var querystring = require('querystring');


var https = require('https');
var fs = require('fs');
var path = require('path');


//perform http request
function performRequest(host, custom_headers, endpoint, method, data, callback) {
    var dataString = JSON.stringify(data);
    var headers = {};

    if (typeof custom_headers != undefined && custom_headers){
        headers = custom_headers;
    }

    if (method == 'GET') {
        endpoint += '?' + querystring.stringify(data);
    } else {
        headers = {
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };
    }

    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
    };

    //console.log("options", options);

    //setup the request
    var req = https.request(options, function(err, res) {
        if(err){
            callback(err);
        }
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            console.log("data:" + data);
            responseString += data;
        });

        res.on('end', function() {
            //console.log("Response:" + responseString);
            try {
                var parsed = JSON.parse(responseString);
            } catch (err) {
                console.error('Unable to parse response as JSON', err);
                return err;
            }
            callback(null, {token: parsed.token});
        });


    });
    //handle the error
    req.on('error', function(err) {
        console.error('Https request error', err);
        callback(err);
    });


    req.write(dataString);
    req.end();

}


//read config
function readConfig(filename, callback){

    var parsed;
    try {

        var data = fs.readFileSync(filename, 'utf8', function (error) {
            if (error) {
                console.log("Error reading config file ... ", error);
                callback(error);
            }
            console.log("Reading File");
        });
        parsed = JSON.parse(data);

    } catch (err) {
        console.error('Unable to parse response as JSON', err);
        callback(err);
    }

    callback(null, parsed);

}

//write config
function writeConfig(filename, config, callback){
    console.log("config", config);
    var written = false;
    try {
        //console.log("write started ... ");
        var data = JSON.stringify(config);
        //console.log("stringify started ... ");
        fs.writeFileSync(filename, data, "utf8", function (error) {
            if (error) {
                console.log("Error writing config file ... ", error);
                callback(error);
            }
            console.log("Writing File");
        });
        console.log('Configuration saved successfully.');
        written = true;
    } catch (err) {
        console.error('Unable to stringify JSON', err);
        callback(err);
    }

    callback(null, written);
}


//export module functions
module.exports = {

    //do the http request
    performRequest: performRequest,

    //loading json encoded data from the text file
    readConfig: readConfig,

    //add to config
    writeConfig: writeConfig

};
