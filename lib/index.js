/**
 * Created by Simon on 22/03/2015.
 */

'use strict';

var Path = require('path');
var Os = require('os');
var Fs = require('fs');

var Hoek = require('hoek');

var internals = {
  defaults: {
    blacklist: ['node_modules', '.git', '.idea'],
    extensions: ['.js', '.json']
  }
};


module.exports = internals.RequirePlus = function (options) {

  Hoek.assert(this.constructor === internals.RequirePlus, 'RequirePlus must be instantiated using new');
  Hoek.assert(typeof options === 'object', 'options must be an object');
  this.moduleSet = {};
  this.settings = Hoek.applyToDefaults(internals.defaults, options);
  this.root = Path.basename(this.settings.directory);
  this.moduleSet = {};
  this.load(this.settings.directory);
  return this;

};


internals.RequirePlus.prototype.exists = function (directory) {
  try {
    return Fs.statSync(directory) && Fs.statSync(directory).isDirectory();
  } catch (e) {
    return false;
  }
};


internals.RequirePlus.prototype.load = function (directory) {
	var self = this;
	var mod;
	var exists = this.exists(directory);
	if (exists) {
		Fs.readdirSync(directory).forEach(function(path) {
			var joined = Path.resolve(directory, path);
			if (Fs.statSync(joined).isDirectory()) {
				var whitelist = new RegExp(self.settings.blacklist.join('|'), 'i').test(path);
				if (!whitelist) {
					self.load(joined);
				}
			} else {
				var validFile = new RegExp(self.settings.extensions.join('|'), 'i').test(path);
				if (validFile) {
					var ext = Path.extname(joined);
					var index = joined.indexOf(self.root);
					var paths = joined.slice(index).replace(ext, '');
					paths = (Os.platform() === 'win32') ? paths.split('\\').slice(1) : paths.split('/').slice(1);

					try {
						mod = new require(joined);
					} catch (e) {
						throw new Error(e);
					}
					self.createTree(self.moduleSet, paths, mod);
				}
			}
		});
	} else {
		throw new Error('Directory does not exist or is a file');
	}
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




