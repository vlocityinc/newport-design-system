const gulp = require('gulp');

const paths = require('../helpers/paths');

gulp.task('icons', callback => {
  gulp
    .src(
      '@salesforce-ux/icons/dist/salesforce-lightning-design-system-icons/**',
      {
        cwd: paths.node_modules
      }
    )
    .pipe(gulp.dest('assets/icons'))
    .on('error', callback)
    .on('finish', callback);
});
