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

    //console.log(options);

    //setup the request
    var req = https.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            //console.log("data:" + data);
            responseString += data;
        });

        res.on('end', function() {
            console.log("Response:" + responseString);
            var responseObject = JSON.parse(responseString);
            success(responseObject);
        });
    });

    //handle the error
    req.on('error', function(e) {
        console.error('error');
        console.error(e);
    });


    req.write(dataString);
    req.end();

}


//read config
function readConfig(filename){

    var myConfig, data = null;

    fs.stat(filename, function(err, stat) {
        if(err == null) {
            console.log('File exists');
            data = fs.readFileSync(filename),
                myConfig;
        } else if(err.code == 'ENOENT') {
            fs.writeFile('log.txt', 'Some log\n');
        } else {
            console.log('Some other error: ', err.code);
        }
    });



    try {
        myConfig = JSON.parse(data);
        console.dir(myConfig);
    }
    catch (err) {
        console.log('There has been an error parsing your JSON.')
        console.log(err);
    }

    return myConfig;
}

//write config
function writeConfig(filename, config){
    var data = JSON.stringify(config);

    fs.writeFile(filename, data, function (err) {
        if (err) {
            console.log('There has been an error saving your configuration data.');
            console.log(err.message);
            return;
        }
        console.log('Configuration saved successfully.')
    });

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