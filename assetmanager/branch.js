'use strict';

const _error_outputs = require('../lib/errors')("Branch");

const transform_error = err => {
    this.error = _error_outputs.INTERNALERROR(err);
    throw this;
};

module.exports = (git_repo_manager, workspace) => {

    const get_name = () => git_repo_manager.get_current_branch()
        .catch(transform_error);

    const get_names = () => git_repo_manager.get_branch_list()
        .catch(transform_error);

    const change = branch => git_repo_manager.change_branch(branch)
        .then(() => workspace.adapter.getFilesRecursively('', ['.git', '.bilrost']))
        .then(files => Promise.all(files.map(workspace.adapter.remove)))
        .then(workspace.remove_all_subscriptions)
        .then(workspace.empty_stage)
        .catch(transform_error);

    const create = branch => git_repo_manager.create_branch(branch)
        .catch(transform_error);

    const del = branch => git_repo_manager.delete_branch(branch)
        .catch(transform_error);

    return {
        get_name: get_name,
        get_names: get_names,
        change: change,
        create: create,
        del: del
    };
};
