'use strict';

const Path = require('path');
const fs = require('fs-extra');

const _error_outputs = require('../lib/errors')("Workspace");
const promisify = require('../util/promisify');
const stringify = require('../util/stringify');
const utilities = require('./utilities');
const repo_manager = require('./repo_manager');

// We don't save until previous save operation succeeded,
// to prevent race conditions between very close saves
let previous_save = Promise.resolve();
const save = function save(workspace_resource) {
    const path_to_workspace = utilities.convert_file_uri_to_path(workspace_resource.file_uri);
    const workspace_properties_file = Path.join(path_to_workspace, '.bilrost', 'workspace');
    return previous_save.then(() => {
        const this_save = promisify(fs.outputFile)(workspace_properties_file, stringify(workspace_resource));
        previous_save = this_save;
        return this_save;
    });

};

const workspace_factory = {
    create_workspace (url, branch, file_uri, name, credentials) {
        const path = utilities.convert_file_uri_to_path(file_uri);
        return new Promise((resolve, reject) => {
                fs.exists(path, exists => {
                    if (exists) {
                        reject(_error_outputs.ALREADYEXIST(path));
                    } else {
                        resolve();
                    }
                });
            })
            .then(() => promisify(fs.mkdirs)(path))
            .then(() => repo_manager.create({
                    host_vcs: 'git',
                    cwd: path,
                    credentials
                }).clone_workspace(url, branch))
            .catch(error => {
                throw error.statusCode === 403 ? error : _error_outputs.INTERNALERROR(error);
            });
    },
    populate_workspace (project, branch, file_uri, name, description) {
        const path = utilities.convert_file_uri_to_path(file_uri);
        const get_internal_file_full_path = name => Path.join(path, '.bilrost', name ? name : '/');
        const create_internal_file = (name, content) => promisify(fs.outputFile)(get_internal_file_full_path(name), stringify(content));
        const create_internal_directory = name => promisify(fs.access)(get_internal_file_full_path(name))
            .then(() => promisify(fs.mkdirs)(get_internal_file_full_path(name)), () => {});
        let guid = workspace_factory.generate_guid();
        let now_iso_date = new Date().toISOString();
        const workspace = {
            guid,
            name,
            description,
            version: '2.0.0',
            created_at: now_iso_date,
            updated_at: now_iso_date,
            pushed_at: null,
            type: 'application/vnd.bilrost.workspace+json',
            branch,
            file_uri,
            tags: [],
            subscriptions: [],
            stage: []
        };
        return create_internal_file("workspace", workspace)
            .then(() => create_internal_file("project", project))
            .then(() => create_internal_directory("assets"))
            .then(() => create_internal_directory("resources"))
            .then(() => workspace)
            .catch(error => {
                throw _error_outputs.INTERNALERROR(error);
            });
    },
    create_and_populate_workspace (project, branch, protocol, file_uri, name, description, credentials) {
        var url;
        if (protocol === 'ssh') {
            url = project.ssh_url;
        } else if (protocol === 'https') {
            url = project.https_url;
        } else {
            throw _error_outputs.INTERNALERROR(`${protocol} is not supported`);
        }
        return workspace_factory.create_workspace(url, branch, file_uri, name, credentials)
            .then(() => workspace_factory.populate_workspace(project, branch, file_uri, name, description));
    },
    save,
    delete_workspace (url) {
        const path = utilities.convert_file_uri_to_path(url);
        return promisify(fs.remove)(path)
            .catch(error => {
                throw _error_outputs.INTERNALERROR(error);
            });
    },
    generate_guid () {
        return require('crypto').randomBytes(20).toString('hex');
    }
};

module.exports = workspace_factory;
