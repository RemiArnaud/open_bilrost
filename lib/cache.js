'use strict';

const fs = require('fs-extra');
const path = require('path');
const promisify = require('../util/promisify');

module.exports = cache_dir_path => ({
    get_path: (key, is_temp) => path.join(cache_dir_path, (key ? key : '') + (is_temp ? '.tmp' : '')),
    write: (key, file_path) => {
        const cache_path = path.join(cache_dir_path, key);
        return promisify(fs.copy)(file_path, cache_path);
    },
    exist: key => promisify(fs.access)(path.join(cache_dir_path, key))
        .catch(err => {
            throw "This cache entry doesn't exist";
        }),
    read: (key, target_path) => {
        const cache_path = path.join(cache_dir_path, key);
        return promisify(fs.copy)(cache_path, target_path);
    }
});
