'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
// const autoprefixer  = require('gulp-autoprefixer');
// const sourcemaps = require('gulp-sourcemaps');
// const sass = require('gulp-sass');
// const gulpIf = require('gulp-if');
// const notify = require('gulp-notify');
// const cssnano = require('gulp-cssnano');
// const rev = require('gulp-rev');
const combine = require('stream-combiner2').obj;


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {
  return function() {
    return combine(
      gulp.src(options.src),
      $.if(isDevelopment, $.sourcemaps.init()),
      $.sass(),
      // $.cssUrlAdjuster({
      //   prepend: ''
      // }),
      $.if(!isDevelopment, combine($.cssnano(), $.rev())),
      $.autoprefixer(['last 15 version', '> 1%', 'ie 11'], {cascade: true}),
      $.if(isDevelopment, $.sourcemaps.write()),
      gulp.dest('public/css'),
      $.if(!isDevelopment, combine($.rev.manifest('css.json'), gulp.dest('manifest')))
    ).on('error', $.notify.onError(function(err) {
      return {
        title: "SASS",
        message: err.message
      };
    }));
  };
};
