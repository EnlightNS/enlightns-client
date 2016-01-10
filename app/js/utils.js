
//load the main process
var remote = require('remote');

var querystring = require('querystring');


var https = require('https');
var fs = require('fs');
var path = require('path');


//perform http request
function performRequest(host, endpoint, method, data, success) {
    var dataString = JSON.stringify(data);
    var headers = {};

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
    var req = https.request(options, function(res) {
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
            return success(null, {
                token: parsed.token
            });
        });


    });
    //handle the error
    req.on('error', function(err) {
        console.error('Https request error', err);
    });


    req.write(dataString);
    req.end();

}


//read config
function readConfig(filename, success){

    var parsed;
    try {

        var data = fs.readFileSync(filename, 'utf8', function (error) {
            if (error) {
                console.log("Error reading config file ... ", error);
                return;
            }
            console.log("Reading File");
        });
        parsed = JSON.parse(data);

    } catch (err) {
        console.error('Unable to parse response as JSON', err);
    }

    return parsed;

}

//write config
function writeConfig(filename, config){
    //console.log("write started ... ");
    var data = JSON.stringify(config);
    //console.log("stringify started ... ");
    fs.writeFileSync(filename, data, "utf8");
    console.log('Configuration saved successfully.');
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