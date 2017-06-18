'use strict';

// const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const notifier = require('node-notifier');
const gulplog = require('gulplog');


module.exports = function(options) {
  return function(callback) {
  let option = {
    context: __dirname + options.src,
    entry: {
      home: "./js/home",
      about: "./js/about"
    },
    output: {
      path: __dirname + options.dst,
      publicPath: '/js/',
      filename: "[name].js",
      library: "[name]"
    },

    watch: NODE_ENV == 'development',
    devtool: NODE_ENV == 'development' ? "cheap-module-inline-source-map" : null,

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'NODE_ENV': JSON.stringify(NODE_ENV)
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common'
      })
    ],
    resolve: {
      modules: ['node_modules'],
      extensions: ['*', '.js']
    },
    resolveLoader: {
      modules: ['node_modules'],
      moduleExtensions: ['-loader', '*'],
      extensions: ['*', '.js']
    },
    module:  {
      loaders: [{
        test:    /\.js$/,
        exclude: /node_modules/,
        loader:  'babel'
      }]
    }
  };

  if (NODE_ENV == 'production') {
    module.exports.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        // don't show unreachable variables etc
        compress: {
          warnings:     false,
          drop_console: true,
          unsafe:       true
        }
      })
    );
  }
  webpack(option, function(err, stats) {
    if (!err) { // no hard error
      // try to get a soft error from stats
      err = stats.toJson().errors[0];
    }

    if (err) {
      notifier.notify({
        title: 'Webpack',
        message: err
      });

      gulplog.error(err);
    } else {
      gulplog.info(stats.toString({
        colors: true
      }));
    }

    // task never errs in watch mode, it waits and recompiles
    if (!option.watch && err) {
      callback(err);
    } else {
      callback();
    }

  });
};
};
