//get common config
var remote = require('remote');

var config = remote.require('config');

var request = require('sync-request')

var os = require('os');

const ipcRenderer = require('electron').ipcRenderer;

function populate(slct1, slct2) {
    var s1 = document.getElementById(slct1);
    var s2 = document.getElementById(slct2);
    var interfaces = os.networkInterfaces();
    var addressArray = [];
    s2.innerHTML = "";
    if (s1.value == "LAN") {
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    addressArray.push(address.address);
                }
            }
        }
    } else if (s1.value == "WLAN") {
        var apiPublicIpMethod = config.get('Api.public_ip.method');
        var apiPublicIpURL = config.get('Api.public_ip.URL');

        console.log("ip", apiPublicIpURL, apiPublicIpMethod)
        var res = request(apiPublicIpMethod, apiPublicIpURL, {
            "headers": {}
        }, function(err) {
            if (err) {
                callback(err);
            }
        });

        json_ip = JSON.parse(res.getBody('utf8'));

        addressArray.push(json_ip['ip']);

    }


    for (var option in addressArray) {
        if (addressArray.hasOwnProperty(option)) {
            var pair = addressArray[option];
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = pair;
            checkbox.value = pair;
            s2.appendChild(checkbox);

            var label = document.createElement('label')
            label.htmlFor = pair;
            label.appendChild(document.createTextNode(pair));

            s2.appendChild(label);
            s2.appendChild(document.createElement("br"));
        }
    }
}
