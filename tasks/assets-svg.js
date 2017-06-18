'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
// const svgSprite = require('gulp-svg-sprite');
// const gulpIf = require('gulp-if');


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

module.exports = function(options) {

  return function() {
    return gulp.src(options.src)
    .pipe($.svgSprite({
        mode: {
          css: {
            dest:       '.', // where to put style && sprite, default: 'css'
            bust:       !isDevelopment,
            sprite:     'sprite.svg', // filename for sprite relative to dest
            layout:     'vertical',
            prefix:     '%-', // .svg-
            dimensions: true,
            render:     {
              scss: {
                dest: 'sprite.scss'
              }
            }
          }
        }
      }))
      .pipe($.if('*.scss', gulp.dest(options.dst1), gulp.dest(options.dst2)));
  };

};
