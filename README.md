# require-plus

[![Build Status](https://travis-ci.org/simon-p-r/require-plus.svg?branch=master)](https://travis-ci.org/simon-p-r/require-plus)
[![Current Version](https://img.shields.io/npm/v/require-plus.svg)](https://www.npmjs.org/package/require-plus)
![Dependencies](http://img.shields.io/david/simon-p-r/require-plus.svg)
![devDependencies](http://img.shields.io/david/dev/simon-p-r/require-plus.svg)




Node module for requiring a directory tree, it will throw if not a valid directory and it will also throw if the object is not exported properly or cannot be required by require.



##Installation

    npm install require-plus

##Usage

    var Plus = require('require-plus');
    var options = {
        blacklist: ['node_modules', '.git', '.idea'],
        extensions: ['.js','.json'],
        directory = ['./test', './some/path', './some/other/path'] // can be a string or an array
    };
    var results = new Plus(options);
    console.log(results);
    //results will contain a moduleSet object (tree of required objects created by constructor)

##Todo

+ ~~100% code coverage~~
+ ~~Handle require errors better~~
+ Add silent error handling option to not throw if something cannot be required by require
