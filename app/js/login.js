//get common config
var remote = require('remote');

var config = remote.require('config');

var utils = require('./js/utils');



//form event listener
var form = document.querySelector('form');
form.addEventListener('submit', function(ev) {

    //get form data
    var login = form.querySelector('input[name="login"]');
    var pass = form.querySelector('input[name="password"]');

    var config_file = __dirname + config.get("Config.filename");

    //send post request
    utils.performRequest(
        config.get('Api.auth.host'),
        config.get('Api.auth.endpoint'),
        config.get('Api.auth.method'), {
            email: login.value,
            password: pass.value
        },
        function(data) {
            var configArray = utils.readConfig(config_file);
            console.log('Logged in:', configArray, data);
        });

});