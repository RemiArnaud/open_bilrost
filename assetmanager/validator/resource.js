'use strict';

module.exports = (workspace_adapter, utilities) => {
    return {
        run_full_validation: ref => workspace_adapter.access(utilities.ref_to_relative_path(ref))
    };
};
