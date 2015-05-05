//Load modules

var Path = require('path');
var Os = require('os');
var Fs = require('fs');

var pathIsAbsolute = require('path-is-absolute');
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
    this.settings = Hoek.applyToDefaults(internals.defaults, options);
    if (Array.isArray(this.settings.directory)) {
        var length = this.settings.directory.length;
        for (var i = 0, il = length; i < il; ++i) {
            exists = this.check(this.settings.directory[i]);
            this.load(exists.root, exists.path);
        }
    } else {
        exists = this.check(this.settings.directory);
        this.load(exists.root, exists.path);
    }
};

internals.RequirePlus.prototype.check = function (path) {

    var obj = {};
    var isAbsolute = pathIsAbsolute(path);
    if (isAbsolute) {
        obj.path = path;
        obj.root = Path.basename(obj.path);

    } else {
        obj.path = Path.resolve(__dirname, path);
        obj.root = Path.basename(obj.path);
    }
    var exists = Fs.existsSync(obj.path) && Fs.statSync(obj.path).isDirectory();
    if (exists) {
        // NO-OP
    } else {
        throw new Error('Directory "' + obj.path + '" either does not exist or is a file instead of a directory');
    }
    return obj;

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
                var index = joined.indexOf(root);
                var paths = joined.slice(index).replace(ext, '');
                paths = (Os.platform() === 'win32') ? paths.split('\\').slice(1) : paths.split('/').slice(1);
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

internals.RequirePlus.prototype.createTree = function (obj, keys, v) {

    if (keys.length === 1) {
        obj[keys[0]] = v;
    } else {
        var key = keys.shift();
        obj[key] = this.createTree(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
    }
    return obj;

};
