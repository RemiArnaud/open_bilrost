'use strict';

const path = require("path").posix;
const file_url = require("file-url");

var workspace_base_path = "";

var cache_urls = [];

function upper_case_drive_letter (url) {
    if (/^win/.test(process.platform)) {
        url = url.substr(0, 8) + url[8].toUpperCase() + url.substr(9);
    }
    return url;
}

const set_workspace_path = path => {
    workspace_base_path = path;
};

const build_file_uri = ref => upper_case_drive_letter(file_url(path.join(workspace_base_path, ref.replace(/\/resources\//, "")), { resolve: false }));

function get_results () {
    const result = {
        coreGetResourceBuildDependency : {},
        coreGetResourceLoadDependency : {}
    };
    result.coreGetResourceBuildDependency[build_file_uri("/resources/a.assembly")] = [
        build_file_uri("/resources/a1.assembly"),
        build_file_uri("/resources/a2.assembly")
    ];
    result.coreGetResourceLoadDependency[build_file_uri("/resources/a.assembly")] = [
        build_file_uri("/resources/a1.wav"),
        build_file_uri("/resources/a2.wav"),
        build_file_uri("/resources/a3.assembly")
    ];
    result.coreGetResourceLoadDependency[build_file_uri("/resources/a3.dae")] = [
        build_file_uri("/resources/b/b1.tga"),
        build_file_uri("/resources/b/b2.tga")
    ];
    result.coreGetResourceLoadDependency[build_file_uri("/resources/simple.assembly")] = [];
    result.coreGetResourceBuildDependency[build_file_uri("/resources/simple.assembly")] = [];
    result.coreGetResourceLoadDependency[build_file_uri("/resources/duck_and_bot.assembly")] = [];
    result.coreGetResourceBuildDependency[build_file_uri("/resources/duck_and_bot.assembly")] = [
        build_file_uri("/resources/duck/duck_polygons.dae"),
        build_file_uri("/resources/mine%20bot%20anim/mine%20bot%20asm.assembly"),
        build_file_uri("/resources/mine%20bot%20anim/resources/mine_bot.material")
    ];
    result.coreGetResourceLoadDependency[build_file_uri("/resources/mine%20bot%20anim/mine%20bot%20asm.assembly")] = [];
    result.coreGetResourceBuildDependency[build_file_uri("/resources/mine%20bot%20anim/mine%20bot%20asm.assembly")] = [
        build_file_uri("/resources/mine%20bot%20anim/resources/sound/tets_sound.wav"),
        build_file_uri("/resources/mine%20bot%20anim/resources/mine_bot.material"),
        build_file_uri("/resources/mine%20bot%20anim/resources/mine_bot_anim.dae")
    ];

    return result;
}

const Conduit = {
    foo : (input, callback) => {
        input ++;
        callback(input);
    },
    bar : (callback, input1, input2) => {
        const res = input1 + input2;
        callback(res);
    },
    coreGetResourceBuildDependency : (url, callback) => {
        url = upper_case_drive_letter(url);
        const urls = get_results().coreGetResourceBuildDependency[url];
        if (urls) {
            callback(urls);
        } else {
            callback([]);
        }
    },
    coreGetResourceLoadDependency : (url, callback) => {
        url = upper_case_drive_letter(url);
        const urls = get_results().coreGetResourceLoadDependency[url];
        if (urls) {
            callback(urls);
        } else {
            callback([]);
        }
    }
};

const get_assembly_load_deps = url => new Promise((resolve, reject) => {
    try {
        Conduit.coreGetResourceLoadDependency(url, list => {
            resolve(list);
        });
    } catch (err) {
        reject(err);
    }
});

const get_assembly_build_deps = url => new Promise((resolve, reject) => {
    try {
        Conduit.coreGetResourceBuildDependency(url, list => {
            resolve(list);
        });
    } catch (err) {
        reject(err);
    }
});

const unique = array => Array.from(new Set(array));
const sanitize_promises_output = output => {
    let list = [];
    output.forEach(value => {
        const is_array = value instanceof Array;
        if (is_array && value.length) {
            list = list.concat(sanitize_promises_output(value));
        } 
        if (!is_array) {
            list.push(value);
        }
    });
    return unique(list);
};

const get_dependencies = url => {
    if (url && !~cache_urls.indexOf(url)) {
        cache_urls.push(url);
        return Promise.all([
            Promise.resolve([url]),
            get_assembly_load_deps(url),
            get_assembly_build_deps(url)
        ]).then(res => sanitize_promises_output(res));
    } else {
        return Promise.resolve([]);
    }
};

const walk_trough_dependencies = deps => Promise.all(deps.map(dep => get_dependencies(dep)))
    .then(res => sanitize_promises_output(res));

const API = {
    dependencies: (path, callback) => get_dependencies(file_url(path, { resolve: false }))
        .then(deps => walk_trough_dependencies(deps))
        .then(deps => {
            callback(undefined, deps);
        })
        .catch(err => {
            callback(err);
        }),
    validate: () => {
        //TODO
    }
};

module.exports =  {
    get_api: () => API,
    set_workspace_path: set_workspace_path
};
