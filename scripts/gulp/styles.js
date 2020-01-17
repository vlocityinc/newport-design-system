// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const autoprefixer = require('gulp-autoprefixer');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const paths = require('../helpers/paths');

gulp.task('styles:sass', () =>
  gulp
    .src([
      'ui/nds-fonts.scss',
      'ui/index.scss',
      'ui/index.rtl.scss',
      'ui/index-scoped.scss',
      'ui/index-scoped.rtl.scss'
    ])
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
      cleanCSS({
        inline: false
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/styles'))
);

gulp.task('styles:framework', gulp.series('styles:sass'));

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

gulp.task('styles', gulp.series('styles:framework', 'styles:test'));
