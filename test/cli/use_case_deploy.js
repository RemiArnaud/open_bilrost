'use strict';

const should = require('should');
const path = require('path').posix;
const exec = require('child_process').exec;

const external_service = require('../../externals/models/external');

const proxy_path = 'proxy.js';

const is_win = /^win/.test(process.platform);
const bilrost_cli_path = path.join(__dirname.replace(/\\/g, '/'), '../../cli');

let external;

describe('Integration tests --DO_NOT_RUN', function () {

    beforeEach("Start bilrost hub", function (done) {
        this.timeout(1000 * 1000);
        external = external_service.create(proxy_path).start();
        should.equal(external.status.get_state(), "RUNNING");
        const log_trigger = "Bilrost started";
        external.stream.stdout.on('data', data => {
            const log = data.toString('utf8');
            console.log(log);
            if(~log.indexOf(log_trigger)) {
               done();
            }
        });
        const err_trigger = "already running!";
        external.stream.stderr.on('data', data => {
            const log = data.toString('utf8');
            console.log(data);
            if(~log.indexOf(err_trigger)) {
               done();
            }
        });
    });

    afterEach("Kill all processes", done => {
        external.stop({ pid: external.pid });
        external.on('close', () => done());
    });

    it('Deploy use case', function (done) {
        this.timeout(1000 * 1000);
        const command = is_win ? 'use_case_deploy.bat' : 'sh use_case_deploy.sh';
        exec(command, { cwd: bilrost_cli_path, readBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            should.not.exist(error);
            console.log(stderr);
            should.equal(stdout.match(/success/gi).length, 15);
            done();
        });
    });

});
