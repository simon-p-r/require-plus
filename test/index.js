// Load modules

var Code = require('code');
var Lab = require('lab');
var Require = require('../lib/index.js');
var Path = require('path');

// Set-up lab
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


describe('initialise', function() {

  it('should throws an error constructed without new', function (done) {

      var fn = function () {

              var plus = Require();
      };

      expect(fn).throws(Error, 'RequirePlus must be instantiated using new');
      done();

  });

  it('should throw on no options object passed to function', function (done) {

      var fn = function () {

              var plus = new Require();
      };

      expect(fn).to.throw('options must be an object');
      done();

  });

  it('should throw if directory does not exist', function (done) {

      var options = {
        directory: 'directory/does/not/exist'
      };

      var fn = function () {

              var plus = new Require(options);
      };

      expect(fn).to.throw('Directory does not exist');
      done();

  });

  it('should throw if directory is a file', function (done) {

      var options = {
        directory: './test/fixtures/aim.conf'
      };

      var fn = function () {

              var plus = new Require(options);
      };

      expect(fn).to.throw('Directory is a file');
      done();

  });

  it('should filter out folders', function (done) {

      var options = {
          directory: 'd:/modules/require-plus/test/fixtures'
      };

      var plus = new Require(options);
      expect(plus.moduleSet.node_modules).to.not.exist();
      done();

  });

  it('should log failed requires to console', function (done) {

      var options = {
          directory: 'd:/modules/require-plus/test/fixtures'
      };

      var plus = new Require(options);

      done();

  });

  it('should filter out non js or json files', function (done) {

      var options = {
          directory: 'd:/modules/require-plus/test/fixtures'
      };

      var plus = new Require(options);
      expect(plus.moduleSet.aim).to.not.exist();
      done();

    });

   it('should build a nested object', function (done) {

      var options = {
        directory: 'd:/modules/aimCore'
      };

      var plus = new Require(options);
      expect(plus.moduleSet).to.exist();
      done();
  });




});
