/**
 * Created by Simon on 22/03/2015.
 */

'use strict';

var Path = require('path');
var Fs = require('fs');

var Hoek = require('hoek');

var internals = {
	defaults: {

	}
};


module.exports = internals.RequirePlus = function (options) {

	Hoek.assert(this.constructor === internals.RequirePlus, 'RequirePlus must be instantiated using new');
    Hoek.assert(typeof options === 'object', 'options must be an object');
	this.moduleSet = {};
    this.settings = Hoek.applyToDefaults(internals.defaults, options);
	this.exists(this.settings.directory);
	this.isDirectory(this.settings.directory);
	this.root = Path.basename(this.settings.directory);
	this.moduleSet = {};
	this.load(this.settings.directory);
	return this;

};

internals.RequirePlus.prototype.exists = function (directory) {
		try {
			Fs.statSync(directory);
		} catch (e) {
			throw new Error('Directory does not exist');
		}
};

internals.RequirePlus.prototype.isDirectory = function (directory) {
	if (Fs.statSync(directory).isDirectory()) {

	} else {
		throw new Error('Directory is a file');
	}
};

internals.RequirePlus.prototype.load = function (directory) {
	var self = this;
	var mod;
	Fs.readdirSync(directory).forEach(function(path) {
		var joined = Path.join(directory, path);
		if (path.indexOf('.git') === -1 && path.indexOf('node_modules') === -1 && path.indexOf('.idea') === -1) {
			if (Fs.statSync(joined).isDirectory()) {
				self.load(joined);
			} else {
				if (path.indexOf('.js') >= 0 || path.indexOf('.json') >= 0) {
					var ext = Path.extname(joined);
					var index = joined.indexOf(self.root);
					var paths = joined.slice(index).replace(ext, '');
					paths = paths.split('\\').slice(1);
					try {
						mod = new require(joined);
					} catch (e) {
						console.error(e.stack);
					}
					self.createTree(self.moduleSet, paths, mod);
				}
			}
		}
	});
	return this;
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




