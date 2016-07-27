# require-plus

[![Build Status](https://travis-ci.org/simon-p-r/require-plus.svg?branch=master)](https://travis-ci.org/simon-p-r/require-plus)
[![Current Version](https://img.shields.io/npm/v/require-plus.svg)](https://www.npmjs.org/package/require-plus)
[![Coverage Status](https://coveralls.io/repos/github/simon-p-r/require-plus/badge.svg?branch=master)](https://coveralls.io/github/simon-p-r/require-plus?branch=master)



Node module for requiring a directory tree, it will throw if not a valid directory and it will also throw if the object is not exported properly or cannot be required by require.


##Installation

    npm install require-plus

##Usage

    var options = {
        blacklist: ['node_modules', '.git', '.idea'],
        extensions: ['.js','.json'],
        directory: ['./test', './some/path', './some/other/path'] // can be a string or an array
    };
    var plus = require('require-plus')(options);
    console.log(plus);
    //plus is an object 

##Todo

+ ~~100% code coverage~~
+ ~~Handle require errors better~~
+ Add silent error handling option to not throw if something cannot be required by require
