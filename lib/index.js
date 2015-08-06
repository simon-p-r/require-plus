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
var moduleSet = {};
var parentDir = Path.dirname(module.parent.filename);
var baseDir = Path.basename(parentDir);
delete require.cache[__filename];


exports.require = function (directory) {

    Hoek.assert(typeof directory === 'string', 'require-plus must be passed a directory to require from');
    var newPath = internals.resolve(directory);
    moduleSet = internals.load(baseDir, newPath, directory);
    return moduleSet;
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


internals.load = function (root, directory, base) {

    var mod;
    Fs.readdirSync(directory).forEach(function (path) {

        var joined = Path.resolve(directory, path);
        if (Fs.statSync(joined).isDirectory()) {
            var blacklist = new RegExp(internals.defaults.blacklist.join('|'), 'i').test(path);
            if (!blacklist) {
                internals.load(root, joined, base);
            }
        } else {
            var validFile = new RegExp(internals.defaults.extensions.join('|'), 'i').test(path);
            if (validFile) {
                var ext = Path.extname(joined);
                var toReplace = Fs.existsSync(Path.resolve(base)) ? toReplace = Path.resolve(base) : toReplace = Path.resolve(parentDir, base);
                var paths = joined.replace(toReplace, '');
                paths = paths.slice(1).replace(ext, '');
                paths = paths.split(Path.sep);
                try {
                    mod = new require(joined);
                } catch (e) {
                    throw new Error('Module cannot be loaded at path ' + joined + ' due to ' + e.message);
                }
                exports.require.createTree(moduleSet, paths, mod);
            }
        }
    });

    return moduleSet;
};


exports.require.createTree = function (obj, keys, v) {

    if (keys.length === 0) {
        return;
    }
    if (keys.length === 1) {
        obj[keys[0]] = v;
    } else {
        var key = keys.shift();
        obj[key] = exports.require.createTree(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);

    }
    return obj;

};
