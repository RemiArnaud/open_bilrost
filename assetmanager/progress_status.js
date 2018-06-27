'use strict';

const Status = require('../status');
const status_config = require('./status.config.json');
const progress = require('progress-stream');

const map_states_to_descriptions = status_config.maps.progress.map_states_to_descriptions;

class Progress extends Status {

    constructor () {
        super('progress', map_states_to_descriptions);
        this.progress = progress({
            time: 100
        });
        this.progress.on('progress', progress => {
            console.log(progress);
            this.set_info('progress', progress);
        });
    }

    set_size (size) {
        this.progress.setLength(size);
    }

    run () {

    }

    sync_from_database () {

    }

}

module.exports = Progress;
