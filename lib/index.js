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
// delete require.cache[__filename];


module.exports = internals.RequirePlus = function (options) {

    Hoek.assert(this.constructor === internals.RequirePlus, 'RequirePlus must be constructed using new');
    Hoek.assert(typeof options === 'object', 'RequirePlus must be constructed with an options object');
    this.moduleSet = {};
    var root = Path.basename(parentDir);
    this.settings = Hoek.applyToDefaults(internals.defaults, options);
    if (Array.isArray(this.settings.directory)) {
        var length = this.settings.directory.length;
        for (var i = 0, il = length; i < il; ++i) {

            this.base = this.resolveRoot(this.settings.directory[i]);
            this.load(root, this.base);
        }
    } else {
        this.base = this.resolveRoot(this.settings.directory);
        this.load(root, this.base);
    }
    return this;
};

internals.RequirePlus.prototype.resolveRoot = function (path) {

    var newPath;
    if (PathIsAbsolute(path)) {
        newPath = path;
    } else {
        newPath = Path.resolve(parentDir, path);
    }

    if (!Fs.existsSync(newPath)) {
        throw new Error('Directory ' + newPath + ' does not exist');
    }
    return newPath;

};


internals.RequirePlus.prototype.load = function (root, directory) {

    var self = this;
    var mod;

    Fs.readdirSync(directory).forEach(function (path) {

        var joined = Path.resolve(directory, path);
        if (Fs.statSync(joined).isDirectory()) {
            var blacklist = new RegExp(self.settings.blacklist.join('|'), 'i').test(path);
            if (!blacklist) {
                self.load(root, joined);
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
