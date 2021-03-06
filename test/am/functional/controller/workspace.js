'use strict';

// Print stack trace for debugging
global.debug = true;

const should = require('should');
const path = require('path').posix;
const fs = require('fs-extra');
const Test_util = require('../../../util/test_util');

var test_util = new Test_util("workspace", "good_repo_v6");

describe('Run Workspace related functional tests for the API', function () {
    /* faking rest3d-client
       we define a rest3d_client that simply calls the callback with
       the predefined parameters.
       These parameters are only declared here, and they are set in
       a before clause according to what we want to test.
     */
    let err, req, res, obj;
    const rest3d_client = {
        get: (url, callback) => callback(err, req, res, obj)
    };

    before("Starting a Content Browser server", done => test_util.start_server(done, {
        rest3d_client: rest3d_client,
        protocol: 'ssh'
    }));

    before("Creating fixtures", function(done) {
        this.timeout(5*this.timeout()); // = 5 * default = 5 * 2000 = 10000
        test_util.create_eloise_fixtures()
            .then(() => test_util.create_eloise_workspace_project_file())
            .then(() => test_util.create_eloise_workspace_properties_file())
            .then(() => test_util.copy_eloise_to_alice_bob_and_philippe())
            .then(() => test_util.add_eloise_to_favorite())
            .then(() => done())
            .catch(err => {
                done(err);
            });
    });
    after("Removing fixtures", done => {
        this.timeout(5*this.timeout()); // = 5 * default = 5 * 2000 = 10000
        test_util.remove_fixtures(done);
    });

    describe('Add Workspaces to favorites', function(){
        it('Add "example1" Workspace to favorites', function(done) {

            test_util.client
                .post('/assetmanager/workspaces/favorites')
                .send({ file_uri: test_util.get_alice_file_uri() })
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .set("Last-Modified", test_util.get_test_level().meta.modified)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    // jshint expr:true
                    test_util.get_favorite().search(test_util.get_alice_file_uri()).should.be.an.Object;
                    done();
                });

        });

        it('Add "example2" Workspace to favorites', function(done){

            test_util.client
                .post('/assetmanager/workspaces/favorites')
                .send({file_uri: test_util.get_bob_file_uri()})
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .set("Last-Modified", test_util.get_test_level().meta.modified)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    // jshint expr:true
                    test_util.get_favorite().search(test_util.get_bob_file_uri()).should.be.an.Object;
                    done();
                });

        });

        it("Fail to add an already existing Workspace to favorites", function(done){
            test_util.client
                .post('/assetmanager/workspaces/favorites')
                .send({file_uri: test_util.get_alice_file_uri()})
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .set("Last-Modified", test_util.get_test_level().meta.modified)
                .expect(403)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    // jshint expr:true
                    test_util.get_favorite().search(test_util.get_alice_file_uri()).should.be.an.Object;
                    done();
                });

        });

        it("Fail to add invalid Workspace to favorites", function(done){

            test_util.client
                .post('/assetmanager/workspaces/favorites')
                .send({file_uri: test_util.get_philippe_file_uri()})
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .set("Last-Modified", test_util.get_test_level().meta.modified)
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });
    });

    describe("Remove Workspaces from favorites", function() {

        it('Remove "example1" Workspace from favorites', function(done){

            test_util.client
                .delete(path.join('/assetmanager/workspaces/', test_util.get_alice_workspace().guid, 'favorites'))
                .set("Accept", 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    test_util.get_favorite().search(test_util.get_alice_file_uri()).should.equal(false);
                    done();
                });

        });

        it('Remove "example2" Workspace from favorites', function(done){

            test_util.client
                .delete(path.join('/assetmanager/workspaces/', test_util.get_bob_workspace().guid, 'favorites'))
                .set("Accept", 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    test_util.get_favorite().search(test_util.get_bob_file_uri()).should.equal(false);
                    done();
                });

        });

        it('Check workspace removal is idempotent', function(done){
            test_util.get_favorite().search(test_util.get_bob_file_uri()).should.equal(false);
            test_util.client
                .delete(path.join('/assetmanager/workspaces/', test_util.get_alice_workspace().guid, 'favorites'))
                .set("Accept", 'application/json')
                .expect(200)
                .end((err, res) => {
                      if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    test_util.get_favorite().search(test_util.get_bob_file_uri()).should.equal(false);
                    done();
                });
        });

    });

    describe("Create workspaces", function () {

        before('Set rest3d_client answer', function () {
            err = false;
            req = null;
            res = null;
            obj = test_util.get_example_project();
        });

        let workspace_guid;
        it('Create a workspace', function (done) {
            this.timeout(8*this.timeout());
            test_util.client
                .post('/assetmanager/workspaces')
                .send({
                    file_uri: test_util.get_carol_file_uri(),
                    from_repo: true,
                    name: test_util.get_example_project().name,
                    description: test_util.get_example_project().description.comment,
                    organization: test_util.get_example_project().owner.login,
                    project_name: test_util.get_example_project().name,
                    branch: 'good_repo_v6',
                })
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    let obj = test_util.get_favorite().search(test_util.get_carol_file_uri());
                    // jshint expr:true
                    obj.should.be.an.Object;
                    should.equal(test_util.does_workspace_exist('new_workspace_v2'), true);
                    workspace_guid = res.body.guid;
                    done();
                });
        });

        it('Reset a workspace', function (done) {
            this.timeout(8*this.timeout());
            fs.writeFileSync(path.join(test_util.get_carol_path(), 'test'), 'Hello world!');
            test_util.client
                .post(`/assetmanager/workspaces/${encodeURIComponent(test_util.get_carol_file_uri())}/reset`)
                .send()
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    should.equal(fs.readdirSync(test_util.get_carol_path()).length, 3);
                    done();
                });
        });


        it('Forget the copied Workspace from favorite list', function(done){
            test_util.client
                .delete(path.join('/assetmanager/workspaces/', workspace_guid, 'favorites'))
                .send()
                .set("Accept", 'application/json')
                .set("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    test_util.get_favorite().search(test_util.get_carol_file_uri()).should.equal(false);
                    done();
                });

        });

        it('Add to favorite list', function (done) {
            test_util.client
                .post('/assetmanager/workspaces/favorites')
                .send({file_uri: test_util.get_carol_file_uri()})
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    let obj = test_util.get_favorite().search(test_util.get_carol_file_uri());
                    // jshint expr:true
                    obj.should.be.an.Object;
                    done();
                });
        });

        it('Delete the created Workspace', function(done){
            test_util.client
                .delete(path.join('/assetmanager/workspaces/', workspace_guid))
                .send()
                .set("Accept", 'application/json')
                .set("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    test_util.get_favorite().search(test_util.get_carol_file_uri()).should.equal(false);
                    should.equal(test_util.does_workspace_exist('new_workspace_v2'), false);
                    done();
                });

        });

        it('Dont create a workspace when the target location already exists', function (done) {
            this.timeout(8*this.timeout());
            test_util.ensure_carol_dir()
                .then(() => {
                    test_util.client
                        .post('/assetmanager/workspaces')
                        .send({
                            file_uri: test_util.get_carol_file_uri(),
                            from_repo: true,
                            name: test_util.get_example_project().name,
                            description: test_util.get_example_project().description.comment,
                            organization: test_util.get_example_project().owner.login,
                            project_name: test_util.get_example_project().name,
                            branch: 'good_repo_v6',
                        })
                        .set("Content-Type", "application/json")
                        .set("Accept", 'application/json')
                        .expect(403)
                        .end((err, res) => {
                            if (err) {
                                return done({ error: err.toString(), status: res.status, body: res.body });
                            }
                            if (~res.body.indexOf('already exist')) {
                                done();
                            } else {
                                done('This error is not the one expected!');
                            }
                        });
                });
        });

    });

    describe('Not implemented Workspace routes', function () {

        it('Fail to create Workspace', function(done) {

            test_util.client
                .put('/assetmanager/workspaces')
                .expect(501)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });

        it('Fail to update Workspace', function(done) {

            test_util.client
                .patch('/assetmanager/workspaces/')
                .expect(501)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });

        it('Fail to replace Workspace', function(done) {

            test_util.client
                .put('/assetmanager/workspaces/')
                .expect(501)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });

    });
});
