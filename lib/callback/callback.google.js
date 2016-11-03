'use strict';

var config = require('../config');
const querystring = require('querystring');
var request = require('request');


module.exports.callback = (event, context, callback) => {
    var appUrl = config.APPLICATION_URL[event.requestContext.stage];

    const res = {
        statusCode: 302, //redirect to application auth url,
    };

    var host = event.headers.Host;
    var stage = event.requestContext.stage;

    var data = {
        redirect_uri: 'https://' + host + '/' + stage + '/callback/google',
        code: event.queryStringParameters.code,
        client_secret: config.GOOGLE_SECRET,
        client_id: config.GOOGLE_ID,
        scope: config.GOOGLE_SCOPE,
        grant_type: 'authorization_code'
    };

    request.post({
        uri: config.GOOGLE_TOKEN_URL,
        formData: data
    }, (error, response, body) => {
        res.headers = {
            location: appUrl + '/auth/google' + '?' + querystring.stringify(JSON.parse(body))
        }
        callback(null, res);   //redirect to front end application
    });

    
}