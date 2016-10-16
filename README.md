# require-plus

[![build status](https://travis-ci.org/simon-p-r/require-plus.svg?branch=master)](https://travis-ci.org/simon-p-r/require-plus)
[![Current Version](https://img.shields.io/npm/v/require-plus.svg?maxAge=1000)](https://www.npmjs.org/package/require-plus)
[![dependency Status](https://img.shields.io/david/simon-p-r/require-plus.svg?maxAge=1000)](https://david-dm.org/simon-p-r/require-plus)
[![devDependency Status](https://img.shields.io/david/dev/simon-p-r/require-plus.svg?maxAge=1000)](https://david-dm.org/simon-p-r/require-plus?type=dev)
[![Coveralls](https://img.shields.io/coveralls/simon-p-r/require-plus.svg?maxAge=1000)](https://coveralls.io/github/simon-p-r/require-plus)


Node module for requiring a directory tree, it will throw if not a valid directory and it will also throw if the object is not exported properly or cannot be required by require.


##Installation

    npm install require-plus

##Usage

    const options = {
        blacklist: ['node_modules', '.git', '.idea'],
        extensions: ['.js','.json'],
        directory: ['./test', './some/path', './some/other/path'] // can be a string or an array
    };

    const plus = require('require-plus')(options);
    console.log(plus);
    //plus is an object containing modules exported from above directories

##Todo

+ ~~100% code coverage~~
+ ~~Handle require errors better~~
+ Add silent error handling option to not throw if something cannot be required by require
