const gulp = require('gulp');
const {
  watchPaths
} = require('../scripts/watch');
require('../scripts/gulp/styles');

class NewportSassWatcherPlugin {
  apply(compiler) {
    let sassWatcher;
    compiler.hooks.watchRun.tap('Newport Sass Compiler', () => {
      if (!sassWatcher) {
        sassWatcher = gulp.watch(watchPaths.sass, gulp.series('styles:sass'));

        sassWatcher.on('change', function (obj, stats) {
          console.log(`File ${obj} was changed`);
        });
      }
    });
  }
}

module.exports = NewportSassWatcherPlugin;
