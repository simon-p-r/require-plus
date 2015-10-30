'use strict';

const Code = require('code');
const Lab = require('lab');
const Plus = require('../lib/index.js');
const Path = require('path');


// Set-up lab
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;




describe('initialise', function () {


    it('should throw an error when constructed without options object', function (done) {

        var fn = function () {

            new Plus();
        };

        expect(fn).throws(Error, 'RequirePlus must be constructed with an options object');
        done();

    });



    it('should throw on invalid directory', function (done) {

        var fn = function () {

            new Plus({
                directory: 'this will fail'
            });
        };

        expect(fn).throws(Error);
        done();

    });

    it('should throw on invalid require', function (done) {

        var fn = function () {

            new Plus({
                directory: Path.resolve(__dirname, './invalid')
            });
        };

        expect(fn).throws(Error);
        done();

    });


    it('should merge optiosn with defaults', function (done) {

        var plus = new Plus({
            blacklist: ['pathA', 'routes'],
            directory: './fixtures'
        });
        expect(plus._settings.blacklist).to.have.length(5);
        expect(plus._settings.blacklist).to.contain(['pathA', 'node_modules']);
        expect(plus.moduleSet.routes).to.not.exist();
        done();

    });

    it('should create a tree of objects from an empty object, array of paths and a value', function (done) {

        var plus = new Plus({
            directory: './fixtures'
        });
        expect(plus.createTree({}, [], {})).to.be.undefined();
        expect(plus.createTree({ test: { nextKey: 'example' } }, ['test', 'example'], {})).to.be.an.object();
        done();

    });

    it('should build a moduleSet object', function (done) {

        var plus = new Plus({
            directory: ['./fixtures']
        });
        expect(plus.moduleSet.node).to.not.exist();
        expect(plus.moduleSet.webstorm).to.not.exist();
        expect(plus.moduleSet).to.be.an.object();
        expect(plus.moduleSet.routes).to.be.an.object();
        expect(plus.moduleSet.routes.endpoints).to.be.an.object();
        expect(plus.moduleSet.routes.endpoints.admin).to.be.an.array();
        done();

    });


});
