'use strict';

const should = require('should');
const path = require('path').posix;
const exec = require('child_process').exec;

const external_service = require('../../externals/models/external');
const repo_manager = require('../../assetmanager/repo_manager');
const workspace_utilities = require('../../assetmanager/workspace_utilities');

const proxy_path = 'proxy.js';

const is_win = /^win/.test(process.platform);
const bilrost_cli_path = path.join(__dirname.replace(/\\/g, '/'), '../../cli');

let external;

describe('Integration tests --DO_NOT_RUN', function () {
   
    beforeEach("Start bilrost hub", function (done) {
        this.timeout(40000);
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
            console.log(log);
            if(~log.indexOf(err_trigger)) {
               done();
            }
        });
    });
    
    afterEach("Kill all processes", done => {
        external.stop({ pid: external.pid });
        external.on('close', () => done());
    });

    it('S3 use case #1', function (done) {
        this.timeout(80000);
        const git = repo_manager.create({
            host_vcs: 'git',
            utilities: workspace_utilities(p => path.join('.bilrost', p ? p : '/'))
        });
        const command = is_win ? 'use_case_s3_1.bat' : 'sh ./use_case_s3_1.sh';
        exec(command, { cwd: bilrost_cli_path }, (error, stdout, stderr) => {
            should.not.exist(error);
            console.log(stderr);
            should.equal(stdout.match(/success/gi).length, 14);
            git.read('/resources/alice_resource.txt', { rev: 'HEAD' })
                .then(() => done('Alice resource still exist!'))
                .catch(err => {
                    if (~err.toString().indexOf("does not exist in 'HEAD'")) {
                        git.read('/assets/test.level', { rev: 'HEAD' })
                            .then(() => done('Alice resource still exist!'))
                            .catch(err => {
                                if (~err.toString().indexOf("does not exist in 'HEAD'")) {
                                    done();
                                } else {
                                    done(err);
                                }
                            });
                    } else {
                        done(err);
                    }
                });
        });
    });

});