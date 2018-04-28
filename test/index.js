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


describe('initialise', () => {


    it('should throw an error when constructed without options object', () => {

        const fn = function () {

            Plus();
        };

        expect(fn).throws(Error, 'RequirePlus must be constructed with an options object');
    });


    it('should throw on invalid directory', () => {

        const fn = function () {

            Plus({
                directory: 'this will fail'
            });
        };

        expect(fn).throws(Error);
    });


    it('should throw on invalid require', () => {

        const invalid = function () {

            Plus({
                directory: Path.resolve(__dirname, './invalid')
            });
        };
        expect(invalid).throws(Error);
        const isFile = function () {

            Plus({
                directory: Path.resolve(__dirname, './fixtures/example.js')
            });
        };
        expect(isFile).throws(Error);
    });


    it('should merge options with defaults', () => {

        const plus = Plus({
            blacklist: ['pathA', 'routes'],
            directory: './fixtures'
        });
        expect(plus.example.example).to.equal('hello');
    });


    it('should build a moduleSet object', () => {

        const plus = Plus({
            directory: ['./fixtures']
        });
        expect(plus.node).to.not.exist();
        expect(plus.webstorm).to.not.exist();
        expect(plus.routes).to.be.an.object();
        expect(plus.routes.endpoints).to.be.an.object();
        expect(plus.routes.endpoints.admin).to.be.an.array();
    });
});
