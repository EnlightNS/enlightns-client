//load the main process
var remote = require('remote');

var querystring = require('querystring');
var https = require('https');

//export module functions
module.exports = {

    //do the http request
    performRequest: function(host, endpoint, method, data, success) {
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

};