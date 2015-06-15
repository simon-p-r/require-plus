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


module.exports = internals.RequirePlus = function (options) {

    Hoek.assert(this.constructor === internals.RequirePlus, 'RequirePlus must be constructed using new');
    Hoek.assert(typeof options === 'object', 'RequirePlus must be constructed with an options object');
    var exists;
    this.moduleSet = {};
    this.root = Path.dirname(module.parent.filename);
    this.settings = Hoek.applyToDefaults(internals.defaults, options);
    if (Array.isArray(this.settings.directory)) {
        var length = this.settings.directory.length;
        for (var i = 0, il = length; i < il; ++i) {
            exists = this.check(this.settings.directory[i]);
            this.load(exists);
        }
    } else {
        exists = this.check(this.settings.directory);
        this.load(exists);
    }
};

internals.RequirePlus.prototype.check = function (path) {

    var newPath;
    var isAbsolute = PathIsAbsolute(path);
    if (isAbsolute) {
        newPath = path;
    } else {
        newPath = Path.resolve(this.root, path);
    }

    if (!Fs.existsSync(newPath)) {
        throw new Error('Directory ' + newPath + ' does not exist');
    }
    return newPath;

};


internals.RequirePlus.prototype.load = function (directory) {

    var self = this;
    var mod;

    var root = Path.basename(directory);
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
                var index = joined.indexOf(root);
                var paths = joined.slice(index).replace(ext, '');
                paths = self.split(paths);

                try {
                    mod = new require(joined);
                } catch (e) {
                    throw new Error('Module cannot be loaded for path ' + joined);
                }
                self.createTree(self.moduleSet, paths, mod);
            }
        }
    });

    return self;
};

internals.RequirePlus.prototype.split = function (paths) {

    return (Os.platform() === 'win32') ? paths.split('\\').slice(1) : paths.split('/').slice(1);

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
