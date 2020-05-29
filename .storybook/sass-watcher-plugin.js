const gulp = require('gulp');
const {
  watchPaths
} = require('../scripts/watch');
require('../scripts/gulp/styles');

class NewportSassWatcherPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tap('Newport Sass Compiler', () => {
      const sassWatcher = gulp.watch(watchPaths.sass, ['styles:sass']);

      sassWatcher.on('change', function (obj, stats) {
        console.log(`File ${obj} was changed`);
      });
    });
  }
}

module.exports = NewportSassWatcherPlugin;
