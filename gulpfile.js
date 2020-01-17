// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

require('@babel/register');

const del = require('del');
const gulp = require('gulp');

const paths = require('./scripts/helpers/paths');

require('./scripts/gulp/icons');
require('./scripts/gulp/lint');
require('./scripts/gulp/styles');

// NOTE: Don't remove reports on purpose.
// This exception is already fixed on the remove-website branch.
gulp.task('clean', () =>
  del.sync([paths.generated, paths.tmp, paths.logs, paths.build, paths.html])
);

gulp.task('build', gulp.series('clean', 'styles', 'icons'));
