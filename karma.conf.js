// Karma configuration
// Generated on Sun Aug 30 2015 01:03:56 GMT+0200 (Mitteleuropäische Sommerzeit)
const istanbul = require('browserify-istanbul');

module.exports = function configuration(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/babelify/node_modules/babel-core/browser-polyfill.js',
      'node_modules/whatwg-fetch/fetch.js',
      'index.js',
      'lib/**/*.js',
      'tests/**/*.test.js',
      {
        pattern: 'tests/assets/**/*.js',
        watched: true,
        served: true,
        included: false,
      },
    ],


    // list of files to exclude
    exclude: [
    ],

    browserify: {
      debug: true,
      transform: ['babelify', istanbul({
        ignore: ['node_modules/**', 'tests/**'],
      })],
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'index.js': ['browserify'],
      'lib/**/*.js': ['browserify'],
      'tests/**/*.test.js': ['browserify'],
      'tests/assets/**/*.es6.js': ['babel'],
    },

    coverageReporter: {
      reporters: [
        {
          type: 'lcov',
          dir: 'coverage',
        },
      ],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'coveralls'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    customLaunchers: {
      ChromeTravis: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS',
      (process.env.TRAVIS ? 'ChromeTravis' : 'Chrome'),
      'Firefox',
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
  });
};
