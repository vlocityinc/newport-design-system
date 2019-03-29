require('@babel/register');

const path = require('path');
const gulp = require('gulp');
const { watchPaths } = require('../scripts/watch');
require('../scripts/gulp/styles');
const WatchFilesPlugin = require('webpack-watch-files-plugin').default;

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.(scss|yml)$/,
    loaders: ['raw-loader'],
    include: path.resolve(__dirname, '../')
  });

  config.plugins.push(
    new WatchFilesPlugin({
      files: ['./assets/styles/*.css'],
      verbose: false
    })
  );

  // Sass
  const sassWatcher = gulp.watch(
    watchPaths.sass,
    ['styles:sass'] // This will trigger watchPaths.css
  );

  sassWatcher.on('change', function(obj, stats) {
    console.log(`File ${obj.path} was changed`);
  });

  gulp.watch(watchPaths.tokens, ['styles:framework']);

  gulp.start('styles:framework');

  // mock fs for comment parser
  config.node = {
    fs: 'empty'
  };

  // Return the altered config
  return config;
};
