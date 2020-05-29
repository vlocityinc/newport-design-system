require('@babel/register');

const path = require('path');
const gulp = require('gulp');
const NewportSassWatcherPlugin = require('./sass-watcher-plugin');

require('../scripts/gulp/styles');

// Export a function. Accept the base config as the only param.
module.exports = async ({
  config,
  mode
}) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.(scss|yml)$/,
    loaders: ['raw-loader'],
    include: path.resolve(__dirname, '../')
  });

  config.plugins.push(new NewportSassWatcherPlugin());

  // Sass
  gulp.start('styles:framework');

  // mock fs for comment parser
  config.node = {
    fs: 'empty'
  };

  // Return the altered config
  return config;
};
