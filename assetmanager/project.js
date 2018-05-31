'use strict';

module.exports = resource => {
    return {
        get_host_vcs: () => resource.description.host_vcs,
        get_full_name: () => resource.full_name
    };
};
