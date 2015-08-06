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

    it('should throw an error when constructed without options object', function (done) {

        var fn = function () {

            var plus = Plus.require();
        };

        expect(fn).throws(Error, 'require-plus must be passed a directory to require from');
        done();

    });


    it('should throw on invalid require', function (done) {

        var fn = function () {

            var plus = Plus.require(Path.resolve(__dirname, './invalid'));
        };

        expect(fn).throws(Error);
        done();

    });


    it('should throw on invalid directory', function (done) {

        var fn = function () {

            var plus = Plus.require('this will fail');
        };

        expect(fn).throws(Error);
        done();

    });


    it('should create a tree of objects from an empty object, array of paths and a value', function (done) {

        var results = Plus.require.createTree({}, [], {});
        expect(results).to.be.undefined();
        expect(Plus.require.createTree({ test: 'example' }, ['test', 'example'], {})).to.be.an.object();
        done();

    });

    it('should build a moduleSet object', function (done) {

        var plus = Plus.require('./fixtures');
        expect(plus.node).to.not.exist();
        expect(plus.webstorm).to.not.exist();
        expect(plus).to.be.an.object();
        expect(plus.routes).to.be.an.object();
        expect(plus.routes.endpoints).to.be.an.object();
        expect(plus.routes.endpoints.admin).to.be.an.array();
        done();

    });


});
