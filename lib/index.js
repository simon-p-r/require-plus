//Load modules

var Path = require('path');
var Os = require('os');
var Fs = require('fs');
var PathIsAbsolute = require('path-is-absolute');
var Hoek = require('hoek');

var internals = {
    defaults: {
        blacklist: ['node_modules', '.git', '.idea'],
        extensions: ['.js', '.json']
    }
};

var parentDir = Path.dirname(module.parent.filename);
var baseDir = Path.basename(parentDir);
delete require.cache[__filename];


module.exports = internals.RequirePlus = function (options) {

    Hoek.assert(this.constructor === internals.RequirePlus, 'RequirePlus must be constructed using new');
    Hoek.assert(typeof options === 'object', 'RequirePlus must be constructed with an options object');
    this.settings = Hoek.applyToDefaults(internals.defaults, options);
    this.moduleSet = {};
    if (Array.isArray(this.settings.directory)) {
        var length = this.settings.directory.length;
        for (var i = 0, il = length; i < il; ++i) {

            this.base = internals.resolve(this.settings.directory[i]);
            this.load(this.base);
        }
    } else {
        this.base = internals.resolve(this.settings.directory);
        this.load(this.base);
    }
    return this;
};

internals.resolve = function (path) {

    if (!PathIsAbsolute(path)) {
        path = Path.resolve(parentDir, path);
    }
    if (!Fs.existsSync(path)) {
        throw new Error('Directory ' + path + ' does not exist');
    }
    return path;

};


internals.RequirePlus.prototype.load = function (directory) {

    var mod;
    var self = this;

    Fs.readdirSync(directory).forEach(function (path) {

        var joined = Path.resolve(directory, path);
        if (Fs.statSync(joined).isDirectory()) {
            var blacklist = new RegExp(self.settings.blacklist.join('|'), 'i').test(path);
            if (!blacklist) {
                self.load(joined);
            }
        } else {
            var validFile = new RegExp(self.settings.extensions.join('|'), 'i').test(path);
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
};


internals.RequirePlus.prototype.createTree = function (obj, keys, v) {

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

};
