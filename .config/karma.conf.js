/*
 * Copyright (c) 2017 SugarCRM Inc. Licensed by SugarCRM under the Apache 2.0 license.
 */

const webpack = require('webpack');
const path = require('path');

module.exports = function (config) {

    config.set({
        basePath: '../',

        files: [
            // peerDependencies
            'node_modules/underscore/underscore.js',
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/jquery-migrate/dist/jquery-migrate.min.js',

            // FIXME remove these and load them in the tests
            'node_modules/sinon/pkg/sinon.js',
            'node_modules/jasmine-sinon/lib/jasmine-sinon.js',

            { pattern: 'test/index.js', watched: false },
        ],

        preprocessors: {
            'test/index.js': ['webpack', 'sourcemap'],
        },

        frameworks: [
            'jasmine',
        ],

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'lcov',
        },

        // web server port
        port: 9876,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        singleRun: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 2,
        browserNoActivityTimeout: 30000,

        webpack: {
            devtool: 'inline-source-map',
            module: {
                preLoaders: [
                    {
                        test: /\.js$/,
                        include: [
                            path.resolve('src'),
                        ],
                        loader: 'istanbul-instrumenter',
                    },
                ],
            },
            plugins: [
                new webpack.DefinePlugin({
                    ZEPTO: JSON.stringify(process.env.ZEPTO),
                }),
            ],
            resolve: {
                root: [
                    path.resolve(__dirname, '../src'),
                    path.resolve(__dirname, '../lib'),
                    path.resolve(__dirname, '../node_modules'),
                ],
                modulesDirectories: [
                    'node_modules',
                ],
                extensions: [
                    '', '.js', '.json',
                ],
            },
        },
        webpackMiddleware: {
            stats: 'errors-only',
        },

        customLaunchers: {
            Chrome_CI: {
                base: 'Chrome',
                flags: ['--no-sandbox'],
            },
            sl_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
                version: 55,
            },
            sl_firefox: {
                base: 'SauceLabs',
                browserName: 'firefox',
            },
            sl_safari: {
                base: 'SauceLabs',
                browserName: 'safari',
            },
            sl_ie: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
            },
            sl_edge: {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
            },
        },

        sauceLabs: {
            testName: 'Ventana Karma Tests',
        },
    });

    if (process.env.TRAVIS) {

        let buildLabel = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;

        config.sauceLabs.build = buildLabel;
        config.sauceLabs.startConnect = false;
        config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;

        // Increase timeout in case connection in CI is slow
        config.browserNoActivityTimeout = 120000;

        config.reporters = ['dots', 'coverage', 'saucelabs'];

        // Allocating a browser can take pretty long (eg. if we are out of
        // capacity and need to wait for another build to finish) and so the
        // `captureTimeout` typically kills an in-queue-pending request, which
        // makes no sense.
        config.captureTimeout = 0;
    }

};
