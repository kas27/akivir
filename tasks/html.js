'use strict';

const gulp = require('gulp');
// const nunjucksRender = require('gulp-nunjucks-render');
// const revReplace = require('gulp-rev-replace');
const $ = require('gulp-load-plugins')();
const combine = require('stream-combiner2').obj;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


module.exports = function(options) {
  return function() {
    return combine(
      gulp.src(options.src),
      $.nunjucksRender({
        path: 'frontend/templates/',
        ext: '.html',
        data: {
          // pathPublic: 'typo3conf/ext/stratis_site/Resources/Public/',
          pathImg: 'assets/img/'
          // pathCss: 'typo3conf/ext/stratis_site/Resources/Public/CSS/',
          // pathJs: 'typo3conf/ext/stratis_site/Resources/Public/JS/'
        }
      }),
      $.if(!isDevelopment, $.revReplace({
        manifest: gulp.src('manifest/css.json', {allowEmpty: true})
      })),
      $.if(!isDevelopment, $.revReplace({
        manifest: gulp.src('manifest/webpack.json', {allowEmpty: true})
      })),
      gulp.dest('public')
    ).on('error', $.notify.onError(function(err) {
      return {
        title: "njk",
        message: err.message
      };
    }));
  };
};
