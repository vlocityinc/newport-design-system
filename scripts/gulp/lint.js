// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const gulp = require('gulp');
const cache = require('gulp-cached');
const gutil = require('gulp-util');
const lintspaces = require('gulp-lintspaces');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const htmlhint = require('gulp-htmlhint');
const tokenlint = require('./plugins/lint-tokens');
const yamlValidate = require('gulp-yaml-validate');

gulp.task('lint:sass', () =>
  gulp
    .src(['site/assets/styles/**/*.scss', 'ui/**/*.scss'])
    .pipe(cache('stylelint'))
    .pipe(
      stylelint({
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
      '*.{js,json,md,yml,txt}',
      '.*',
      '!.DS_Store',
      '!LICENSE-icons-images.txt',
      '!CONTRIBUTING.md',
      'ui/**/*.*',
      'site/**/*.{js,jsx,sh,scss,yml,md,xml}',
      'scripts/**/*.{js,sh,jsx}'
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

gulp.task('lint:tokens:yaml', () =>
  gulp
    .src(['./ui/components/**/tokens/*.yml', './design-tokens/aliases/*.yml'])
    .pipe(yamlValidate())
);

gulp.task('lint:tokens:components', () =>
  gulp
    .src([
      './ui/components/**/tokens/*.yml',
      '!./ui/components/**/tokens/bg-*.yml', // icons
      '!./ui/components/**/tokens/force-font-commons.yml' // fonts
    ])
    .pipe(tokenlint())
    .pipe(tokenlint.report('verbose'))
);

gulp.task('lint:tokens:aliases', () =>
  gulp
    .src(['./design-tokens/aliases/*.yml'])
    .pipe(tokenlint({ prefix: false }))
    .pipe(tokenlint.report('verbose'))
);

gulp.task('lint:tokens', [
  'lint:tokens:yaml',
  'lint:tokens:components',
  'lint:tokens:aliases'
]);

gulp.task('lint', ['lint:sass', 'lint:spaces', 'lint:js', 'lint:tokens']);
