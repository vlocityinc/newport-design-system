// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const gulp = require('gulp');
const cache = require('gulp-cached');
const lintspaces = require('gulp-lintspaces');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');

gulp.task('lint:sass', () =>
  gulp
    .src('ui/**/*.scss')
    .pipe(cache('stylelint'))
    .pipe(
      stylelint({
        fix: true,
        reporters: [
          {
            formatter: 'string',
            console: true
          }
        ]
      })
    )
);

gulp.task('lint:spaces', () =>
  gulp
    .src([
      '*.{js,json,md,txt}',
      '.*',
      '!.DS_Store',
      '!LICENSE-icons-images.txt',
      '!CONTRIBUTING.md',
      'ui/**/*.*',
      'scripts/**/*.{js}'
    ])
    .pipe(cache('lintspaces'))
    .pipe(
      lintspaces({
        editorconfig: '.editorconfig',
        ignores: [
          /\/\*[\s\S]*?\*\//g // Ignore comments
        ]
      })
    )
    .pipe(lintspaces.reporter())
);

function lintjs(files, options) {
  return () => {
    return gulp
      .src(files)
      .pipe(cache('lintjs'))
      .pipe(eslint(options))
      .pipe(eslint.format('codeframe'));
  };
}

gulp.task(
  'lint:js',
  lintjs([
    '*.js',
    'app_modules/**/*.{js,jsx}',
    'scripts/**/*.{js,jsx}',
    'site/**/*.{js,jsx}',
    'ui/**/*.{js,jsx}',
    '!**/*.spec.{js,jsx}'
  ])
);

gulp.task('lint',  gulp.series('lint:sass', 'lint:spaces', 'lint:js'));
