require("@babel/register");
const path = require("path");
const gulp = require("gulp");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const NewportSassWatcherPlugin = require("./sass-watcher-plugin");
require("../scripts/gulp/styles");

const smp = new SpeedMeasurePlugin();
// const createCompiler = require("@storybook/addon-docs/mdx-compiler-plugin");

module.exports = {
  stories: [
    "../ui/*/*.stories.js",
    "../ui/*/*/*.stories.js",
    "../ui/*/*/*/*.stories.js",
    "../docs/*/*.stories.js",
  ],
  addons: [
    "@storybook/addon-knobs",
    "@storybook/addon-viewport",
    "@storybook/addon-links"
  ],
  webpackFinal: (serverConfig) => {
    serverConfig.module.rules.push({
      test: /\.(scss|yml)$/,
      loaders: ["raw-loader"],
      exclude: [/node_modules/],
      include: path.resolve(__dirname, "../"),
    });

    // serverConfig.module.rules.push({
    //   test: /\.(stories|story)\.js?$/,
    //   loader: require.resolve("@storybook/source-loader"),
    //   exclude: [/node_modules/],
    //   enforce: "pre",
    // });

    serverConfig.plugins = serverConfig.plugins.filter(plugin => {
      return !(plugin instanceof CaseSensitivePathsPlugin);
    })

    serverConfig.plugins.push(new NewportSassWatcherPlugin());
    // Sass
    gulp.series("styles:framework")();
    // mock fs for comment parser
    serverConfig.node = {
      fs: "empty",
    };

    //return smp.wrap(serverConfig);
    return serverConfig;
  },
};
