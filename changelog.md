##Changelog

>2.1.1 - bumped deps and addedd coveralls

>2.1.0 - updated deps and travis file 

>2.0.0 - constructor is created by wrapper function which returns just the value of requiring directory, also added test to ensure input directory is not a file and updated devDependencies lab

>1.5.0 - module changed to work with ES6 features and node 4 or greater, some dependencies removed and deepmerge package added. Test for constructor removed as strict mode won't allow this, also added test to show options being properly merged between user input and internal defaults.  Therefore blacklisting folders works properly.

>1.4.1 - tidied up and tried to fix issue with path not resolving correctly

>1.4.0 - removed delete require.cache[__filename] as was losing reference to real base directory to resolve from, cleaned up linting and tidied up dependencies

>1.3.1 - fixed bug that was hiding error from try catch, required modules were not resolving due to missing dependencies

>1.3.0 - fixed bug of not returning correct moduleSet value and fixed tests to catch bug

>1.2.0 - bumped version as previously published module prohibited publish to npm registery

>1.0.0 - fixed resolving of path passed to constructor, reached 100% code coverage and have added error handling for failed module (error is thrown)

>0.1.1 - fixed bug with root path not resolving correctly, still can't cover code by 100%

>0.1.0 - removed some tests and improve testing based on os, added some tpye checking for buildTree method and created split path method

>0.0.9 - used path-is-absolute module to fill missing function in nodejs path library, fixed issue with past resolving incorrectly

>0.0.8 - options directory can be a single string or an array of strings, better checking of directory existence after partial path is passed within options object to constructor which is resolved internally by module.  Raised code coverage to nearly 98%

>0.0.7 - added badges for npm and dependency version, changed directory paramater in options object for constructor(takes array of paths rather than one path string)

>0.0.6 - lowered threshold for testing to pass travis build

>0.0.5 - bug not fixed properly

>0.0.4 - fixed bug on Linux with paths not being separated for build tree method

>0.0.3 - improving coverage of tests

>0.0.2 - tidy up internals to accept options correctly, improved tests and added travis build

>0.0.1 - initial commit
