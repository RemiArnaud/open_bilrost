'use strict';

require('should');

describe('Favorite object', function () {
    const favorite = require('../../../assetmanager/favorite')();

    const example_1 = {
        "guid": "0001",
        "name": "example_1",
        "file_uri": "file:///C:/Users/Maxime/Documents/fl4re-ui/example_1"
    };

    const example_2 = {
        "guid": "002",
        "name": "example_2",
        "file_uri": "file:///C:/Users/Maxime/Documents/fl4re-ui/example_2"
    };

    before("Flush favorite list", favorite.flush);
    after("Flush favorite list", favorite.flush);

    describe('Adding', function(){
        it('Add example1 workspace to favorite list', function(){
            return favorite.add(example_1).then(() => {
                return favorite.list().length.should.equal(1);
            });
        });

        it('Dont add workspace with same name', function (done) {
            favorite.add(example_1)
                .then(() => {
                    done('This shouldnt pass!');
                }).catch(err => {
                    if (err.statusCode === 403) {
                        done();
                    } else {
                        done(err);
                    }
                });
        });

        it('Add example2 workspace to favorite list', function(){
            return favorite.add(example_2).then(() => {
                return favorite.list().length.should.equal(2);
            });
        });
    });

    describe("Removing", function(){
        it('removes a workspace index by guid', function(){
            return favorite.remove(example_1.guid).then(() => {
                return favorite.list().length.should.equal(1);
            });
        });

        it('removes a workspace by file_uri', function(){
            return favorite.remove(example_2.file_uri).then(() => {
                return favorite.list().length.should.equal(0);
            });
        });

        it('doesnt complain removing unexisting workspaces', function () {
            return favorite.remove(example_1.guid).then(() => {
                return favorite.list().length.should.equal(0);
            });
        });

    });

    describe('Finding', () => {
        before(function () {
            return favorite.flush().then(() => favorite.add(example_1));
        });
        it('finds by guid', () => {
            favorite.find_by_guid(example_1.guid).should.equal(example_1);
        });
        it('finds by name', () => {
            favorite.find_by_name(example_1.name).should.equal(example_1);
        });
        it('finds by file_uri', () => {
            favorite.find_by_file_uri(example_1.file_uri).should.equal(example_1);
        });
    });

});
