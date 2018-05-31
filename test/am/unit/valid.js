'use strict';

// Print stack trace for debugging
global.debug = true;

const path = require('path');
const should = require('should');
const favorite = require('../../../assetmanager/favorite')();
const ifs_adapter = require('../../util/mocks/ifs_adapter');
const Test_util = require('../../util/test_util');
const assets_collection = require('../../../assetmanager/databases/assets_collection');
const status_collection = require('../../../assetmanager/databases/status_collection');
const workspace_utilities = require('../../../assetmanager/workspace_utilities');

const ifs_map = {
    "access" : {
        "test/test.assembly" : () => Promise.resolve(),
        "test.assembly" : () => Promise.resolve(),
        "invalid_path.assembly" : () => Promise.reject("invalid path"),
        "test/prefab/test.assembly" : () => Promise.resolve(),
        "test/test04.assembly" : () => Promise.resolve(),
        "prefab/test.assembly" : () => Promise.resolve(),
    }
};

const partial_ifs_map = {
    "access" : {
        "test/test.assembly" : () => Promise.reject("invalid path"),
        "test.assembly" : () => Promise.reject("invalid path"),
        "invalid_path.assembly" : () => Promise.reject("invalid path"),
        "test/prefab/test.assembly" : () => Promise.resolve()
    }
};

describe('Valid object', function () {

    var test_util = new Test_util("valid_unit_test", "bad_repo_v4");

    const workspace_identifiers = {
        guid: "e39d0f72c81c445ba801dsssssss45219sddsdss",
        name: "test-workspace",
        file_uri: test_util.get_eloise_file_uri()
    };

    const AssetValidator = require('../../../assetmanager/validator/asset');
    let valid_asset_instance, partial_asset_instance;

    before("create fixtures", function(done) {
        this.timeout(5*this.timeout()); // = 5 * default = 5 * 2000 = 10000
        test_util.create_eloise_fixtures()
            .then(() => {
                const workspace_path = test_util.get_eloise_path();
                const adapter = ifs_adapter(workspace_path, ifs_map);
                const adapter_with_missing_resource = ifs_adapter(workspace_path, partial_ifs_map);
                const fake_workspace = {
                    get_guid: () => workspace_identifiers.guid,
                    adapter: adapter,
                    database: assets_collection(workspace_identifiers.guid),
                    status_collection: status_collection(workspace_identifiers.guid),
                    utilities: workspace_utilities(p => path.join('.bilrost', p))
                };
                valid_asset_instance = new AssetValidator(fake_workspace);

                const failing_fake_workspace = {
                    get_guid: () => workspace_identifiers.guid,
                    adapter: adapter_with_missing_resource,
                    database: assets_collection(workspace_identifiers.guid),
                    utilities: workspace_utilities(p => path.join('.bilrost', p))
                };
                partial_asset_instance = new AssetValidator(failing_fake_workspace);
                Promise.all([
                    favorite.add(workspace_identifiers),
                    valid_asset_instance.database.add(test_util.read_asset_file("/assets/test_1_1_0.level")),
                    valid_asset_instance.database.add(test_util.read_asset_file("/assets/prefab/test_2_1_0.prefab")),
                    valid_asset_instance.database.add(test_util.read_asset_file("/assets/asset_wrong_type.prefab")),
                    valid_asset_instance.database.add(test_util.read_asset_file("/assets/asset_invalid_path.prefab")),
                    valid_asset_instance.database.add(test_util.read_asset_file("/assets/asset_wrong_schema.prefab")),
                ]).then(function(){
                    done();
                }).catch(done);
            });
    });

    after("Clean favorite list", function(done) {
        favorite.remove(workspace_identifiers.guid).then(done);
    });

    after("Reset database", function (done) {
        valid_asset_instance.database.close()
            .then(done, done);
    });

    describe('#run_full_validation method', function () {

        describe('for one asset ref', () => {
            it('validates a valid asset', function () {
                return valid_asset_instance.run_full_validation('/assets/test_1_1_0.level')
                    .then(validations => {
                        validations.length.should.equal(1);
                        const asset_result = validations[0];
                        asset_result.ref.should.equal('/assets/test_1_1_0.level');
                        asset_result.state.should.equal('VALID');
                        should.not.exist(asset_result.error);
                    });
            });

            it('returns no error if ref doesn\'t exist', function (done) {
                valid_asset_instance.run_full_validation('/assets/invalid')
                    .catch(err => {
                        if (err === '/assets/invalid is not found') {
                            done();
                        } else {
                            done(err);
                        }
                    });
            });

            it('returns error for an asset with version not supported', function () {
                return valid_asset_instance.run_full_validation('/assets/prefab/test_2_1_0.prefab')
                    .then(validations => {
                        validations.length.should.equal(1);
                        const asset_result = validations[0];
                        should.exist(asset_result.error);
                        asset_result.error.should.startWith("2.1.0 version number is not supported");
                    });
            });

            it('returns error for an asset with wrong schema', function () {
                return valid_asset_instance.run_full_validation('/assets/asset_wrong_schema.prefab')
                    .then(validations => {
                        validations.length.should.equal(1);
                        should.exist(validations[0].error);
                    });
            });

            it('returns error for an asset with invalid path', function () {
                return valid_asset_instance.run_full_validation('/assets/asset_invalid_path.prefab')
                    .then(validations => {
                        validations.length.should.equal(1);
                        should.exist(validations[0].error);
                    });
            });

            it('returns error for an asset with missing Resource dependency', function () {
                return partial_asset_instance.run_full_validation('/assets/test_1_1_0.level')
                    .then(validations => {
                        validations.length.should.equal(1);
                        should.exist(validations[0].error);
                    });
            });

        });

        describe('for a namespace ref', function () {

            it('validates assets from root namespace', function () {
                return valid_asset_instance.run_full_validation('/assets/')
                    .then(validations => {
                        should.equal(validations.length, 4);
                        const v_1_1_0 = validations.find(elem => elem.ref === "/assets/test_1_1_0.level");
                        should.not.exist(v_1_1_0.error);
                        const error_validations = validations.filter(elem=>elem.error);
                        should.equal(error_validations.length, 2);
                    });
            });

            it('can validate assets recursively', function () {
                return valid_asset_instance.run_full_validation('/assets/', {recursive: true})
                    .then(validations => {
                        should.equal(validations.length, 5);
                        const v_1_1_0 = validations.find(elem=>elem.ref === "/assets/test_1_1_0.level");
                        should.not.exist(v_1_1_0.error);
                        const error_validations = validations.filter(elem=>elem.error);
                        should.equal(error_validations.length, 3);
                    });
            });

        });

    });

    describe('#run_bare_validation', function () {
        it('validates a valid asset without checking dependencies', function () {
            return valid_asset_instance
                .run_bare_validation('/assets/test_1_1_0.level')
                .then(validations => {
                    validations.length.should.equal(1);
                    should.not.exist(validations[0].error);
                });
        });

        it('returns error for an asset with wrong schema', function () {
            return valid_asset_instance.run_bare_validation('/assets/asset_wrong_schema.prefab')
                .then(validations => {
                    validations.length.should.equal(1);
                    should.exist(validations[0].error);
                });
        });

        it('Fail bare validation on invalid path', function (done) {
            valid_asset_instance.run_bare_validation('/invalid')
                .then(() => {
                    done("This shouldn't pass!");
                }).catch(err => {
                    should.exist(err);
                    done();
                });
        });
    });

});
