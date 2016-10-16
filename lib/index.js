'use strict';

const Fs = require('fs');
const Hoek = require('hoek');
const Merge = require('deepmerge');
const Path = require('path');
const Utils = require('basic-utils');

const internals = {
    defaults: {
        blacklist: ['node_modules', '.git', '.idea'],
        extensions: ['.js', '.json']
    }
};


const parentDir = Path.dirname(module.parent.filename);
delete require.cache[__filename];

class RequirePlus {

    constructor(options) {

        Hoek.assert(typeof options === 'object', 'RequirePlus must be constructed with an options object');
        this._settings = Merge(internals.defaults, options);
        this.moduleSet = {};
        if (Utils.isArray(this._settings.directory)) {
            const length = this._settings.directory.length;
            for (let i = 0; i < length; ++i) {

                this.base = internals.resolve(this._settings.directory[i]);
                this.load(this.base);
            }
        }
        else {
            this.base = internals.resolve(this._settings.directory);
            this.load(this.base);
        }
    }

    load(directory) {

        let mod;
        const files = internals.readDir(directory);
        files.forEach((path) => {

            const joined = Path.resolve(directory, path);
            if (Utils.isDir(joined)) {
                const blacklist = new RegExp(this._settings.blacklist.join('|'), 'i').test(path);
                if (!blacklist) {
                    this.load(joined);
                }
            }
            else {
                const validFile = new RegExp(this._settings.extensions.join('|'), 'i').test(path);
                if (validFile) {
                    const ext = Path.extname(joined);
                    let paths = joined.replace(this.base, '');
                    paths = paths.slice(1).replace(ext, '');
                    paths = paths.split(Path.sep);
                    try {
                        mod = new require(joined);
                    }
                    catch (e) {
                        throw e;
                    }
                    internals.createTree(this.moduleSet, paths, mod);
                }
            }
        });
    }
};

internals.createTree = (obj, keys, v) => {

    // $lab:coverage:off$
    if (keys.length === 0) {
        return;
    }
    // $lab:coverage:on$
    if (keys.length === 1) {
        obj[keys[0]] = v;
    }
    else {
        const key = keys.shift();
        // $lab:coverage:off$
        obj[key] = internals.createTree(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
        // $lab:coverage:on$
    }
    return obj;
};

internals.readDir = (path) => {

    try {
        return Fs.readdirSync(path);
    }
    catch (e) {
        throw e;
    }

};

internals.resolve = (path) => {

    if (!Path.isAbsolute(path)) {
        path = Path.resolve(parentDir, path);
    }

    return path;

};


module.exports = (options) => {

    return new RequirePlus(options).moduleSet;

};
