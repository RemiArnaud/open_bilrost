'use strict';

const should = require('should');
const path = require('path').posix;
const Test_util = require('../../../util/test_util');
const favorite = require('../../../../assetmanager/favorite')();

describe('Run Content Browser related test for content browser api', function () {

    var test_util = new Test_util("browse", "good_repo_v6");

    before("Starting a Content Browser server", done => test_util.start_server(done));

    before("Creating fixtures", function(done) {
        this.timeout(10*this.timeout()); // = 5 * default = 5 * 2000 = 10000
        test_util.create_eloise_fixtures()
            .then(() => test_util.create_eloise_workspace_project_file())
            .then(() => test_util.create_eloise_workspace_properties_file())
            .then(() => test_util.copy_eloise_to_alice_bob_and_philippe())
            .then(() => test_util.create_workspace3())
            .then(() => test_util.add_eloise_to_favorite())
            .then(() => done())
            .catch(done);
    });

    after("Removing fixtures", done => test_util.remove_fixtures(done));

    describe('-- [GET] /contentbrowser', function(){
        it("", function(done) {

            test_util.client
                .get('/contentbrowser')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });
    });

    describe('-- [GET] /contentbrowser/projects/', function(){
        it("", function(done) {

            test_util.client
                .get('/contentbrowser/projects/')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });
    });

    describe('-- [GET] /contentbrowser/projects/:org', function(){
        it("", function(done) {

            test_util.client
                .get('/contentbrowser/projects/fl4re')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });
    });

    describe('-- [GET] /contentbrowser/projects/:project_full_name', function(){
        it("", function(done) {

            test_util.client
                .get('/contentbrowser/projects/StarbreezeStudios/cloud-test-project-2')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });
        });
    });

    describe('-- [GET] /contentbrowser/projects/:project_full_name/', function(){
        it("", function(done) {

            test_util.client
                .get('/contentbrowser/projects/StarbreezeStudios/cloud-test-project-2')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });
    });

    describe('-- [GET] /contentbrowser/projects/:project_full_name/:branch_name/assets/', function(){
        it("Check we can't list project assets without authorization", function(done) {

            test_util.client
                .get('/contentbrowser/projects/StarbreezeStudios/cloud-test-project-2/assets/')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });


        });
    });

    describe('-- [GET] /contentbrowser/projects/:project_full_name/:branch_name/:assets_ref', function(){
        it("Check we can't list project assets without authorization", function(done) {

            test_util.client
                .get('/contentbrowser/projects/StarbreezeStudios/cloud-test-project-2/assets/test.level')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect(500)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });
    });

    describe('-- [GET] /contentbrowser/workspaces/', function() {

        before("Add example2 workspace", function (done) {

            test_util.client.post('/assetmanager/workspaces/favorites')
                .send({ "file_uri": test_util.get_bob_file_uri() })
                .set("Content-Type", 'application/json')
                .set("Accept", 'application/json')
                .expect('Content-Type', 'application/vnd.bilrost.workspace+json')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    test_util.get_favorite().search(test_util.get_bob_file_uri()).should.be.an.instanceOf(Object);
                    done();
                });

        });


        after("Remove example3 workspace settings", function (done) {

            favorite.remove(test_util.get_example3_workspace().guid)
                .then(() => done())
                .catch(done);

        });

        it("Retrieve example1 and example2 workspaces only", function(done){

            test_util.client
                .get('/contentbrowser/workspaces/')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.length.should.be.above(1);
                    obj.totalItems.should.be.above(1);
                    done();
                });

        });

        it("Can't retrieve example3 workspace with its associated invalid statuses", function(done){

            favorite.add({
                guid: test_util.get_example3_workspace().guid,
                name: test_util.get_example3_workspace().name,
                file_uri: test_util.get_example3_file_uri(),
                status : [
                    {
                        context: "asset_validator",
                        state: "INVALID",
                        description: "The validation failed!",
                        info: {}
                    },
                    {
                        context: "workspace_validator",
                        state: "DELETED",
                        description: "The validation is missing!",
                        info: {}
                    }
                ]
            }).then(function () {
                test_util.client
                    .get('/contentbrowser/workspaces/' + test_util.get_example3_workspace().guid)
                    .set("Content-Type", "application/json")
                    .set("Accept", 'application/json')
                    .expect(403)
                    .end((err, res) => {
                        if (err) {
                            return done({ error: err.toString(), status: res.status, body: res.body });
                        }
                        done();
                    });
            });
        });

        it("Retrieve example1 and example2 workspaces only without example3", function(done){

            test_util.client
                .get('/contentbrowser/workspaces/')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.length.should.be.above(1);
                    obj.totalItems.should.be.above(1);
                    done();
                });

        });

        it("Retrieve example3 workspace after changing its associated statuses to valid", function(done){

            favorite.update(test_util.get_example3_workspace().guid, {
                guid: test_util.get_example3_workspace().guid,
                name: test_util.get_example3_workspace().name,
                url: test_util.get_example3_file_uri(),
                status : [
                    {
                        context: "asset_validator",
                        state: "VALID",
                        description: "The validation succeeded!",
                        info: {}
                    },
                    {
                        context: "workspace_validator",
                        state: "VALID",
                        description: "The validation succeeded!",
                        info: {}
                    }
                ]
            }).then(function () {
                test_util.client
                    .get('/contentbrowser/workspaces/' + test_util.get_example3_workspace().guid)
                    .set("Content-Type", "application/json")
                    .set("Accept", 'application/json')
                    .expect("Content-Type", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            return done({ error: err.toString(), status: res.status, body: res.body });
                        }
                        done();
                    });

            }).catch(done);

        });

        it("Retrieve example1, example2 and example3", function(done){

            test_util.client
                .get('/contentbrowser/workspaces/')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.length.should.be.above(2);
                    obj.totalItems.should.above(2);
                    done();
                });

        });

        it('Check "paging" query paramaters for retrieving workspaces', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/?maxResults=1')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    obj.items.length.should.be.above(0);
                    obj.totalItems.should.be.above(1);
                    test_util.client
                        .get(obj.nextLink)
                        .set("Content-Type", "application/json")
                        .set("Accept", 'application/json')
                        .expect("Content-Type", "application/json")
                        .expect(200)
                        .end((err, res) => {
                            let obj = res.body;
                            if (err) {
                                return done({ error: err.toString(), status: res.status, body: obj });
                            }
                            obj.items.length.should.be.above(0);
                            obj.totalItems.should.be.above(1);
                            done();
                        });
                });

        });

        it('Check "filter" query paramaters for retrieving workspaces', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/?name='+ test_util.get_bob_workspace().name)
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                     obj.items.should.have.lengthOf(1);
                    obj.totalItems.should.equal(1);
                    done();
                });
        });

        it("Can't retrieve example3 workspace since it has been removed from favorite list", function(done){

            favorite.remove(test_util.get_example3_workspace().guid)
                .then(function () {
                    test_util.client
                        .get('/contentbrowser/workspaces/' + test_util.get_example3_workspace().guid)
                        .set("Content-Type", "application/json")
                        .set("Accept", 'application/json')
                        .expect(400)
                        .end((err, res) => {
                            if (err) {
                                return done({ error: err.toString(), status: res.status, body: res.body });
                            }
                            done();
                        });
                });
        });

    });

    describe('-- [GET] /contentbrowser/workspaces/{id}', function() {

        const example2 = test_util.get_bob_workspace();

        it('retrieves example2 by name', (done) => {
            test_util.client
                .get('/contentbrowser/workspaces/'+ example2.name)
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.items.should.containDeep([example2]);
                    done();
                });
        });

        it('retrieves example2 by guid', (done) => {
            test_util.client
                .get('/contentbrowser/workspaces/'+ example2.guid)
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.items.should.containDeep([example2]);
                    done();
                });
        });

        it('retrieves example2 by file uri', (done) => {
            test_util.client
                .get('/contentbrowser/workspaces/'+ encodeURIComponent(example2.file_uri))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.items.should.containDeep([example2]);
                    done();
                });
        });
    });

    describe('-- [GET] /contentbrowser/workspaces/{workspace_guid}/assets/', function () {

        it('Retrieve test asset', function(done){
            test_util.client
                .get(path.join('/contentbrowser/workspaces/', test_util.get_bob_workspace().guid, test_util.get_test_level().meta.ref))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/vnd.bilrost.level+json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.should.containDeep(test_util.get_test_level());
                    done();
                });

        });

        it("Don't retrieve unknown asset", function(done) {

            test_util.client
                .get('/contentbrowser/workspaces/'+ test_util.get_bob_workspace().name +'/assets/unknown')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });

        it("Retrieve assets in prefab namespace", function(done){

            test_util.client
                .get(path.join('/contentbrowser/workspaces/', test_util.get_bob_workspace().name, '/assets/prefab/'))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.length.should.be.above(1);
                    obj.totalItems.should.equal(2);
                    done();
                });

        });

        it('Check "paging" query paramaters for retrieving assets in prefab namespace', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/' + test_util.get_bob_workspace().guid + '/assets/prefab/?maxResults=1')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.totalItems.should.equal(2);
                    test_util.client
                        .get(obj.nextLink)
                        .set("Content-Type", "application/json")
                        .set("Accept", 'application/json')
                        .expect("Content-Type", "application/json")
                        .expect(200)
                        .end((err, res) => {
                            let obj = res.body;
                            if (err) {
                                return done({ error: err.toString(), status: res.status, body: obj });
                            }
                            obj.items.should.have.lengthOf(1);
                            obj.totalItems.should.equal(2);
                            done();
                        });
                });

        });

        it('Check "filter" query paramaters for retrieving assets in prefab namespace', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/prefab/?ref=*')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.length.should.be.above(1);
                    obj.totalItems.should.equal(2);
                    done();
                });

        });

        it('Search one asset', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q=mall')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.totalItems.should.equal(1);
                    done();
                });

        });

        it('Search all levels', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q='+encodeURIComponent(".level"))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.length.should.be.above(1);
                    obj.totalItems.should.be.above(1);
                    done();
                });

        });

        it('Search all levels OR test prefab', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q='+encodeURIComponent(".level OR test tag: TEST"))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.length.should.be.above(2);
                    obj.totalItems.should.be.above(2);
                    done();
                });

        });

        it('Search all levels OR test prefab', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q='+encodeURIComponent("type: level AND NOT (1_1_0 OR tag: TEST)"))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    should.exist(obj.items);
                    done();
                });

        });

        it('Search all assets created between 2000 and 2020', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q='+encodeURIComponent('created:.. 2000 2040 AND comment: "test asset!"'))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.totalItems.should.equal(1);
                    done();
                });

        });

        it('Search for asset with specific dependency', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q='+encodeURIComponent('dependency: /resources/test/test.assembly'))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.totalItems.should.equal(1);
                    done();
                });

        });

        it('Find 0 results searching for asset with invalid dependency', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q='+encodeURIComponent('dependency: /resources/test/test.invalid'))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(0);
                    obj.totalItems.should.equal(0);
                    done();
                });

        });

        it('Search for asset with specific tag', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q='+encodeURIComponent('tag: TEST'))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.totalItems.should.equal(1);
                    done();
                });

        });

        it('Find 0 results searching for asset with invalid tag', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/assets/?q='+encodeURIComponent('tag: TESTWRONG'))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(0);
                    obj.totalItems.should.equal(0);
                    done();
                });

        });

    });

    describe('-- [GET] /contentbrowser/workspaces/{workspace_guid}/resources/', function(){

        after("Remove example2 workspace", function (done) {

            test_util.client
                .delete('/assetmanager/workspaces/'+test_util.get_bob_workspace().guid)
                .set("accept", "application/json")
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    test_util.get_favorite().search(test_util.get_bob_file_uri()).should.equal(false);
                    done();
                });

        });


        it('Retrieve mall resource from example2 workspace using name identifier', function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/resources/mall/mall_demo.assembly')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.path.toUpperCase().should.equal(path.join(test_util.get_bob_path(), '/mall/mall_demo.assembly').toUpperCase());
                    obj.ref.should.equal('/resources/mall/mall_demo.assembly');
                    done();
                });

        });

        it("Don't retrieve unknown resource", function(done) {

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/resources/unknown')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });


        it("Don't retrieve unknown resource", function(done) {

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/resources/assets')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: res.body });
                    }
                    done();
                });

        });

        it("Retrieve resources in root folder", function(done){


            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/resources/')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(4);
                    obj.totalItems.should.equal(4);
                    obj.items.map(item => item.should.have.properties("ref", "path"));
                    done();
                });

        });

        it('Check "paging" query paramaters for retrieving resources in root folder', function (done) {

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/resources/?maxResults=1')
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(1);
                    obj.items.map(item => item.should.have.properties("ref", "path"));
                    obj.totalItems.should.equal(4);
                    test_util.client
                        .get(obj.nextLink)
                        .set("Content-Type", "application/json")
                        .set("Accept", 'application/json')
                        .expect("Content-Type", "application/json")
                        .expect(200)
                        .end((err, res) => {
                            let obj = res.body;
                            if (err) {
                                return done({ error: err.toString(), status: res.status, body: obj });
                            }
                            obj.items.should.have.lengthOf(1);
                            obj.items.map(item => item.should.have.properties("ref", "path"));
                            obj.totalItems.should.equal(4);
                            done();
                        });
                });
        });

        it("Retrieve resources in root folder with search query", function(done){

            test_util.client
                .get('/contentbrowser/workspaces/'+test_util.get_bob_workspace().guid+'/resources/?q='+encodeURIComponent("(test OR mall) AND extension: assembly"))
                .set("Content-Type", "application/json")
                .set("Accept", 'application/json')
                .expect("Content-Type", "application/json")
                .expect(200)
                .end((err, res) => {
                    let obj = res.body;
                    if (err) {
                        return done({ error: err.toString(), status: res.status, body: obj });
                    }
                    obj.items.should.have.lengthOf(11);
                    obj.items.map(item => item.should.have.properties("ref", "path"));
                    obj.totalItems.should.equal(11);
                    done();
                });

        });

    });

});
