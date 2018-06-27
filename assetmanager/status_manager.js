'use strict';

const integrity_status = require('./integrity_status');
const Progress_status = require('./progress_status');
const General_status = require('../status');
const errors = require('../lib/errors')("Status manager");

const status_config = require('./status.config.json');
const map_states_to_priorities = status_config.maps.integrity.map_states_to_priorities;

function Status_manager (workspace) {
    const workspace_adapter = workspace.adapter;
    const workspace_host_vcs = workspace.project.get_host_vcs();
    if (!workspace_host_vcs) {
        this.error = errors.INTERNALERROR("Workspace host version control is unknown");
        throw this;
    }

    this.adapter = workspace_adapter;
    this.asset_repo_manager = workspace.asset.repo_manager;
    this.resource_repo_manager = workspace.resource.repo_manager;
    this.status = [
        new integrity_status.Asset(workspace),
        new integrity_status.Workspace(workspace),
        new Progress_status()
    ];

    this.general_status = new General_status('general');

    this.get_statuses = () => this.status;

    this.get_status = ref => this.get_statuses().find(status => status.get_ref() === ref);

    this.update_and_retrieve_status = () => this.sync_all_status_from_database()
        .then(() => this.get_statuses());

    this.sync_all_status_from_database = () => Promise.all(this.get_statuses().map(status => status.sync_from_database()));

    this.get_general_status = () => this.sync_all_status_from_database()
        .then(() => {
            this.general_status.set_state(status_config.tokens.integrity.VALID);
            let result_priority = map_states_to_priorities[this.general_status.get_state()];
            this.get_statuses()
                .filter(status => status.get_ref() !== 'progress')
                .forEach((item, index, array) => {
                    let current_priority = map_states_to_priorities[item.get_state()];
                    if (current_priority > result_priority) {
                        this.general_status.set_state(item.get_state());
                        this.general_status.set_info('guilty_ref', item.get_ref());
                        this.general_status.set_info('guilty_info', item.get_info());
                        result_priority = current_priority;
                    }
                });
            return this.general_status;
        });

    this.run_all_status = () => Promise.all(this.get_statuses().map(status => status.run()));

    this.check_overall_validation = () => this.asset_repo_manager.validate_vcs()
        .then(() => this.sync_all_status_from_database())
        .then(() => {
            let workspace = this.get_status("workspace_validator");
            return this.run_all_status()
                .then(() => {
                    let invalid_status_list = this.get_statuses()
                        .filter(status => status.get_ref() !== 'progress' && status.get_state() !== status_config.tokens.integrity.VALID);
                    if (!invalid_status_list.length) {
                        return workspace.save_status()
                            .then(() => this);
                    } else {
                        this.error = errors.INTERNALERROR(JSON.stringify(invalid_status_list.map(status => status.status.info)));
                        throw this;
                    }
                });
        });

    return this;

}

module.exports = Status_manager;
