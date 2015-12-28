//get common config
var remote = require('remote');

var config = remote.require('config');

var utils = require('./js/utils');
var log_file = __dirname + 'logs/login.log';


//form event listener
var form = document.querySelector('form');
form.addEventListener('submit', function(ev) {

    //get form data
    var login = form.querySelector('input[name="login"]');
    var pass = form.querySelector('input[name="password"]');

    auth_api_config = config.get("Api.auth");

    //send post request
    utils.performRequest(
        config.get('Api.auth.host'),
        config.get('Api.auth.endpoint'),
        config.get('Api.auth.method'), {
            email: login.value,
            password: pass.value
        },
        function(data) {
            console.log('Logged in:', data);
        });

});