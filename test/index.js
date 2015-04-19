// Load modules

var Code = require('code');
var Lab = require('lab');
var Require = require('../lib/index.js');
var Path = require('path');
var Fs = require('fs');

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
        directory: ['./directory/does/not/exist']
      };

      var fn = function () {

              var plus = new Require(options);
      };

      expect(fn).to.throw('Directory does not exist or is a file');
      done();

  });

  it('should throw if directory is a file', function (done) {

      var options = {
        directory: [Path.resolve(__dirname, './fixtures/aim.conf')]
      };

      var fn = function () {

              var plus = new Require(options);
      };

      expect(fn).to.throw('Directory does not exist or is a file');
      done();

  });

  it('should throw if settings directory is not an array', function (done) {

      var options = {
          directory: Path.resolve(__dirname, './fixtures')
      };

      var fn = function () {

          var plus = new Require(options);
      };

      expect(fn).to.throw(Path.resolve(__dirname, './fixtures') + ' is not an array');
      done();

  });

    it('should test for existance of directory', function (done) {

        var options = {
            directory: [Path.resolve(__dirname, './fixtures')]
        };

        var plus = new Require(options);

        var localExists = plus.exists(options.directory[0]);
        var globalExists = Fs.statSync(options.directory[0]) && Fs.statSync(options.directory[0]).isDirectory();
        expect(localExists).to.be.true();
        expect(localExists).to.equal(globalExists);
        done();

    });

  it('should filter out folders', function (done) {

      var options = {
          directory: [Path.resolve(__dirname, './fixtures')]
      };

      var plus = new Require(options);

      expect(plus.moduleSet.node_modules).to.not.exist();
      done();

  });

  it('should return true if directory exists', function (done) {

      var options = {
          directory: [Path.resolve(__dirname, './fixtures')]
      };

      var plus = new Require(options);
      expect(plus.exists(options.directory[0])).to.be.true();
      done();

  });

  it('should filter out non js or json files', function (done) {

      var options = {
        directory: [Path.resolve(__dirname, './fixtures')]
      };

      var plus = new Require(options);
      expect(plus.moduleSet.aim).to.not.exist();
      done();

    });

   it('should build a nested object', function (done) {

      var options = {
        directory: [Path.resolve(__dirname, './fixtures')]
      };

      var plus = new Require(options);
      expect(plus.moduleSet).to.exist();
      done();
  });


});
