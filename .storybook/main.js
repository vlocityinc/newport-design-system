require("@babel/register");
const path = require("path");
const gulp = require("gulp");
const NewportSassWatcherPlugin = require("./sass-watcher-plugin");
require("../scripts/gulp/styles");

// const createCompiler = require("@storybook/addon-docs/mdx-compiler-plugin");

module.exports = {
  stories: [
    "../ui/**/*.stories.@(js|mdx)",
    "../docs/**/*.stories.js",
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
      include: path.resolve(__dirname, "../"),
    });

    serverConfig.module.rules.push({
      // 2a. Load `.stories.mdx` / `.story.mdx` files as CSF and generate
      //     the docs page from the markdown
      test: /\.(stories|story)\.mdx$/,
      use: [
        {
          loader: "babel-loader",
          // may or may not need this line depending on your app's setup
          options: {
            plugins: ["@babel/plugin-transform-react-jsx"],
          },
        },
        // {
        //   loader: "@mdx-js/loader",
        //   options: {
        //     compilers: [createCompiler({})],
        //   },
        // },
      ],
    });

    serverConfig.module.rules.push({
      test: /\.(stories|story)\.[tj]sx?$/,
      loader: require.resolve("@storybook/source-loader"),
      exclude: [/node_modules/],
      enforce: "pre",
    });

    serverConfig.plugins.push(new NewportSassWatcherPlugin());
    // Sass
    gulp.series("styles:framework")();
    // mock fs for comment parser
    serverConfig.node = {
      fs: "empty",
    };
    return serverConfig;
  },
};
