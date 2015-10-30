'use strict';

const Fs = require('fs');
const Hoek = require('hoek');
const Merge = require('deepmerge');
const Path = require('path');

const internals = {
    defaults: {
        blacklist: ['node_modules', '.git', '.idea'],
        extensions: ['.js', '.json']
    }
};

const parentDir = Path.dirname(module.parent.filename);
delete require.cache[__filename];

module.exports = internals.Plus = class RequirePlus {

    constructor (options) {

        Hoek.assert(typeof options === 'object', 'RequirePlus must be constructed with an options object');
        this._settings = Merge(internals.defaults, options);
        this.moduleSet = {};
        if (Array.isArray(this._settings.directory)) {
            var length = this._settings.directory.length;
            for (var i = 0, il = length; i < il; ++i) {

                this.base = internals.resolve(this._settings.directory[i]);
                this.load(this.base);
            }
        } else {
            this.base = internals.resolve(this._settings.directory);
            this.load(this.base);
        }
        return this;
    }

    load (directory) {

        var mod;
        var self = this;

        Fs.readdirSync(directory).forEach(function (path) {

            var joined = Path.resolve(directory, path);
            if (Fs.statSync(joined).isDirectory()) {
                var blacklist = new RegExp(self._settings.blacklist.join('|'), 'i').test(path);
                if (!blacklist) {
                    self.load(joined);
                }
            } else {
                var validFile = new RegExp(self._settings.extensions.join('|'), 'i').test(path);
                if (validFile) {
                    var ext = Path.extname(joined);
                    var paths = joined.replace(self.base, '');
                    paths = paths.slice(1).replace(ext, '');
                    paths = paths.split(Path.sep);
                    try {
                        mod = new require(joined);
                    } catch (e) {
                        throw new Error('Module cannot be loaded at path ' + joined + ' due to ' + e.message);
                    }
                    self.createTree(self.moduleSet, paths, mod);
                }
            }
        });
        return self;
    }

    createTree (obj, keys, v) {

        if (keys.length === 0) {
            return;
        }
        if (keys.length === 1) {
            obj[keys[0]] = v;
        } else {
            var key = keys.shift();
            obj[key] = this.createTree(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
        }
        return obj;
    }

};

internals.resolve = function (path) {

    if (!Path.isAbsolute(path)) {
        path = Path.resolve(parentDir, path);
    }
    if (!Fs.existsSync(path)) {
        throw new Error('Directory ' + path + ' does not exist');
    }
    return path;

};
