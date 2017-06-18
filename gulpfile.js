'use strict';

const gulp = require('gulp');
const webpack = require('webpack');
const notifier = require('node-notifier');
const gulplog = require('gulplog');
const AssetsPlugin = require('assets-webpack-plugin');
const path = require('path');


const options = {
  src: {
    styles: './frontend/scss/style.scss',
    njk: './frontend/templates/**/*.njk',
    assets: './frontend/assets/**',
    assetsImg: ['./frontend/templates/modules/**/*.{jpg,png}', './frontend/templates/partials/**/*.{jpg,png}' ],
    assetsSvg: ['./frontend/templates/modules/**/*.svg', './frontend/templates/partials/**/*.svg', './frontend/assets/img/**/*.svg'],
  },
  watch: {
    styles1: ['./frontend/scss/**/*.*', 'tmp/scss/sprite.scss'],
    styles2: './frontend/templates/**/*.scss',
    njk: './frontend/templates/**/*.njk',
    assets: './frontend/assets/**/*.*',
    assetsImg: ['./frontend/templates/modules/**/*.{jpg,png}', './frontend/templates/partials/**/*.{jpg,png}' ],
    assetsSvg: ['./frontend/templates/modules/**/*.svg', './frontend/templates/partials/**/*.svg', './frontend/assets/**/.svg']
  },
  build: {
    html: './dist/',
    css: './dist/style/',
    assets: './public/assets/',
    assetsImg: './public/assets/img/',
    assetsSvg1: './tmp/scss/',
    assetsSvg2: './public/css/'
  }
};

function lazyRequireTask(taskName, path, options) {
  options = options || {};
  options.taskName = taskName;
  gulp.task(taskName, function(callback) {
    let task = require(path).call(this, options);

    return task(callback);
  });
}

lazyRequireTask('styles', './tasks/sass', {
  src: options.src.styles
});

lazyRequireTask('njk', './tasks/html', {
  src: options.src.njk
});

lazyRequireTask('clean', './tasks/clean', {
  dst: ['./public', './tmp',  './manifest']
});

lazyRequireTask('assets', './tasks/assets', {
  src: options.src.assets,
  dst: options.build.assets
});

lazyRequireTask('assetsImg', './tasks/assets-img', {
  src: options.src.assetsImg,
  dst: options.build.assetsImg
});

lazyRequireTask('assetsSvg', './tasks/assets-svg', {
  src: options.src.assetsSvg,
  dst1: options.build.assetsSvg1,
  dst2: options.build.assetsSvg2
});

const NODE_ENV = process.env.NODE_ENV || 'development';

gulp.task('webpack', function(callback) {

  let options = {
    context: __dirname + '/frontend/js',
    entry:   {
      main: "./main",
      about: "./about",
      common: "./common"
    },
    output:  {
      path:  __dirname + '/public/js',
      publicPath: 'js/',
      filename: NODE_ENV == 'development' ? '[name].js' : '[name]-[chunkhash:10].js',
      chunkFilename: "[id].[name].js"﻿,
      library: "[name]"
    },
    watch: NODE_ENV == 'development',
    devtool: NODE_ENV == 'development' ? "cheap-module-inline-source-map" : false,
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
        include: path.join(__dirname, "/frontend"),
        loader:  'babel'
      }]
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.ProvidePlugin({ //подключать либы без рекваера
        _: 'lodash'
      }),
      new webpack.DefinePlugin({
        'NODE_ENV': JSON.stringify(NODE_ENV)
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        minChunks: 2
      })
    ]
  };

  if (NODE_ENV == 'production') {
    options.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            // don't show unreachable variables etc
            warnings:     false,
            unsafe:       true
          }
        }),
        new AssetsPlugin({
          filename: 'webpack.json',
          path:     __dirname + '/manifest',
          processOutput(assets) {
            for (let key in assets) {
              assets[key + '.js'] = assets[key].js.slice(options.output.publicPath.length);
              delete assets[key];
            }
            return JSON.stringify(assets);
          }
        })
    );

  }

  // https://webpack.github.io/docs/node.js-api.html
  webpack(options, function(err, stats) {
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
    if (!options.watch && err) {
      callback(err);
    } else {
      callback();
    }

  });


});

gulp.task('build', gulp.series('clean', gulp.parallel('assetsImg', 'assetsSvg', 'assets', 'webpack'), 'styles', 'njk'));


lazyRequireTask('serve', './tasks/serve', {
  src: 'public'
});

gulp.task('dev',
    gulp.series(
        'build',
        gulp.parallel(
            'serve',
            function() {
              gulp.watch(options.watch.styles1, gulp.series('styles'));
              gulp.watch(options.watch.styles2, gulp.series('styles'));
              gulp.watch(options.watch.njk, gulp.series('njk'));
              gulp.watch(options.watch.assets, gulp.series('assets'));
              gulp.watch(options.watch.assetsImg, gulp.series('assetsImg'));
              gulp.watch(options.watch.assetsSvg, gulp.series('assetsSvg'));
            }
        )
    )
);