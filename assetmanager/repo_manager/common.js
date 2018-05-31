'use strict';

class Repo_manager {
    constructor (input) {
        this.utilities = input.utilities;
        this.credentials = input.credentials;
        this.cwd = input.cwd;
        this.exec = input.exec;
        this.exec_by_line = input.exec_by_line;
    }
}

module.exports = Repo_manager;
