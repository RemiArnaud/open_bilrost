'use strict';

module.exports = port => new Promise((resolve, reject) => {
    const PORT = port || require('./port_factory')();
    var s3config = require('config').get('S3');
    const rest3d_server_config = {
        predefined_sessions: {
            '1234': {
                login: 'fake_user_name',
                teams: [{slug: 'cloud'}],
                access_token: '6d1bebf7699873f3e9cec1431665ed538d451c25'
            }
        },
        registry_url: 'not used here',
        github: {
            teams: ['cloud']
        },
        S3: s3config
    };

    const rest3d_client = require('../../lib/rest3d-client')('http://localhost:' + PORT, __dirname);
    /* setup a rest3d server */
    const rested = require('@sb/rested');
    const restify = require('restify');
    const rest3d_server = restify.createServer({});
    rest3d_server.use(restify.bodyParser());
    rested(rest3d_server, rest3d_server_config);
    rest3d_server.listen(PORT, err => {
        if (err) {
            reject(err);
        } else {
            resolve(rest3d_client);
        }
    });

});
