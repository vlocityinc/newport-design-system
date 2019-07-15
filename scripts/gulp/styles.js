// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const autoprefixer = require('gulp-autoprefixer');
const gulp = require('gulp');
const minifycss = require('gulp-minify-css');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');

const paths = require('../helpers/paths');

gulp.task('styles:sass', [], () =>
  gulp
    .src(['ui/nds-fonts.scss', 'ui/index.scss', 'ui/index.rtl.scss'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass
        .sync({
          precision: 10,
          includePaths: [paths.ui, paths.node_modules]
        })
        .on('error', sass.logError)
    )
    .pipe(autoprefixer({ remove: false }))
    .pipe(
      minifycss({
        advanced: false,
        roundingPrecision: '-1',
        processImport: false
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/styles'))
);

gulp.task('styles:framework', [], () =>
  gulp.start('styles:sass')
);

// Quick check that all variants compile correctly to CSS
gulp.task('styles:test', () =>
  gulp
    .src(['ui/index-*.scss', 'ui/index-*.rtl.scss'])
    .pipe(
      sass
        .sync({
          includePaths: [paths.node_modules]
        })
        .on('error', sass.logError)
    )
    .pipe(gulp.dest('assets/styles/.test'))
);

gulp.task('styles', callback => {
  runSequence('styles:framework', 'styles:test', callback);
});
