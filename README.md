#require-plus


Node module for loading js files via require when supplied with a valid directory, if the directory is not valid it will throw.  It will also throw if the object is not exported properly or cannot be resolved through require.



##Installation

    npm install require-plus

##Usage

    var requirePlus = require('require-plus');
    var options : {
        blacklist: ['node_modules', '.git', '.idea'],
        extensions: ['.js','.json']
    };
    // if options are not set the standard defaults shown above will be applied
    var results = requirePlus('./routes', options);
    console.log(results);
    //results will be a object set of objects with the keys showing a representation of file tree

##Todo

+ Add tests
+ Blacklist directories
+ Bypass any EPREM with file permission issues
+ Improve hash object created (recursively) to be keys representing position in file system, for example if a module is in /some/path/file.js the returned object should be

    {some:{path:{file: object}}};