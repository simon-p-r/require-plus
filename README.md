# require-plus 

[![Build Status](https://travis-ci.org/simon-p-r/require-plus.svg?branch=master)](https://travis-ci.org/simon-p-r/require-plus)
[![Current Version](https://img.shields.io/npm/v/require-plus.svg)](https://www.npmjs.org/package/require-plus)
![Dependencies](http://img.shields.io/david/simon-p-r/require-plus.svg)
![devDependencies](http://img.shields.io/david/dev/simon-p-r/require-plus.svg)




Node module for loading js files via require when supplied with a valid directory, if the directory is not valid it will throw.  It will also throw if the object is not exported properly or cannot be resolved through require.



##Installation

    npm install require-plus

##Usage

    var Plus = require('require-plus');
    var options : {
        blacklist: ['node_modules', '.git', '.idea'],
        extensions: ['.js','.json']
    };
    // if options are not set the standard defaults shown above will be applied, however you must include a directory string in options object which is passed to constructor
    options.directory = ['./test', './some/path', './some/other/path'];
    var results = new Plus(options);
    console.log(results);
    //results will contain a moduleSet object (tree of required objects created by constructor), settings (options object passed to constructor) and root (root directory which object tree is built from)

##Todo

+ 100% code coverage
+ Handle require errors better
