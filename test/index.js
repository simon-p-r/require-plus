// Load modules

var Code = require('code');
var Lab = require('lab');
var Plus = require('../lib/index.js');
var Path = require('path');
var Fs = require('fs');
var Os = require('os');

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

            var plus = new Plus();
        };

        expect(fn).throws(Error, 'RequirePlus must be constructed with an options object');
        done();

    });


    it('should throw on invalid require', function (done) {

        var fn = function () {

            var plus = new Plus({
                directory: Path.resolve(__dirname, './invalid')
            });
        };

        expect(fn).throws(Error);
        done();

    });


    it('should throw on invalid directory', function (done) {

        var fn = function () {

            var plus = new Plus({
                directory: ['example']
            });
        };

        expect(fn).throws(Error);
        done();

    });


    it('should create a tree of objects from an empty object, array of paths and a value', function (done) {

        var plus = new Plus({
              directory: ['./fixtures']
        });

        expect(plus.createTree({}, [], {})).to.be.undefined();
        expect(plus.createTree({ test: 'example' }, ['test', 'example'], plus.moduleSet)).to.be.an.object();
        done();

    });

    it('should build a moduleSet object', function (done) {

        var plus = new Plus({
              directory: ['./fixtures'],
              blacklist: ['node', 'webstorm']
        });
        expect(plus.moduleSet.node).to.not.exist();
        expect(plus.moduleSet.webstorm).to.not.exist();
        expect(plus.moduleSet.admin).to.be.an.array();
        expect(plus.moduleSet.test).to.be.an.object();
        done();

    });


});
