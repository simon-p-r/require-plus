// Load modules

var Code = require('code');
var Lab = require('lab');
var Plus = require('../lib/index.js');
var Path = require('path');
var Fs = require('fs');

// Set-up lab
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;




describe('initialise', function () {

    it('should throw an error when constructed without new', function (done) {

        var fn = function () {

            var plus = Plus();
        };

        expect(fn).throws(Error, 'RequirePlus must be constructed using new');
        done();

    });

    it('should throw an error when constructed without options object', function (done) {

        var fn = function () {

            var plus = new Plus('Test');
        };

        expect(fn).throws(Error, 'RequirePlus must be constructed with an options object');
        done();

    });

    it('should throw an error when directory does not exists', function (done) {

        var fn = function () {

            var plus = new Plus({directory: 'Test'});
        };

        expect(fn).throws(Error);
        done();

    });

    it('should apply defaults to options object', function (done) {

        var plus = new Plus({
          directory: './test/fixtures'
        });

        expect(plus.settings.blacklist.length).to.equal(3);
        done();

    });

    it('should loop through array of directories', function (done) {

        var plus = new Plus({
          directory: [Path.resolve(__dirname, './fixtures')]
        });

        expect(plus.settings.directory.length).to.equal(1);
        done();

    });

    it('should filter directories', function (done) {

        var plus = new Plus({
          directory: [Path.resolve(__dirname, './fixtures')]
        });

        expect(plus.moduleSet.node_modules).to.not.exist();
        expect(plus.moduleSet['.idea']).to.not.exist();
        done();

    });

    it('should throw on invalid require', function (done) {

        var fn = function () {

            var plus = new Plus({
                directory: [Path.resolve(__dirname, './invalid')]
            });
        };

        expect(fn).throws(Error);
        done();

    });

    it('should build a moduleSet object', function (done) {

        var plus = new Plus({
              directory: [Path.resolve(__dirname, './fixtures')]
        });


        expect(plus.moduleSet.test).to.be.an.object();
        done();

    });


});
