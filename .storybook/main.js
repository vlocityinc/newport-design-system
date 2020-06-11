require("@babel/register");
const webpackMerge = require("webpack-merge");
const path = require("path");
const moduleLoader = require.resolve(
  "lwc-services/lib/utils/webpack/module-loader"
);
const ModuleResolver = require("lwc-services/lib/utils/webpack/module-resolver");
const gulp = require("gulp");
const NewportSassWatcherPlugin = require("./sass-watcher-plugin");
require("../scripts/gulp/styles");
function getWebpackEntryPaths(entry) {
  if (typeof entry === "string") {
    return [entry];
  }
  if (entry instanceof Array) {
    return entry;
  }
  const paths = [];
  Object.keys(entry).forEach((name) => {
    const path = entry[name];
    if (typeof path === "string") {
      paths.push(path);
    } else {
      paths.concat(path);
    }
  });
  return paths;
}
module.exports = {
  stories: ["../ui/**/*.stories.js", "../docs/**/*.stories.js"],
  addons: [
    "@storybook/addon-knobs",
    "@storybook/addon-viewport",
    "@storybook/addon-links",
  ],
  webpackFinal: (customConfig) => {
    const MODULE_CONFIG = {
      path: path.resolve("src/modules"),
    };
    // this part tells Webpack which files to the LWC module loader on
    // it'll match all js, ts, html and css files in the `src/modules` directory
    // but it'll exclude anything named `*.stories.js/ts` in those directories.
    let serverConfig = {
      module: {
        rules: [
          {
            test: /\.(scss|yml|md)$/,
            loaders: ["raw-loader"],
            include: path.resolve(process.cwd()),
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
            include: path.resolve(__dirname, "../"),
          },
          {
            test: /\.(js|ts|html|css)$/,
            exclude: /\.stories\.(js|ts)$/,
            include: [
              MODULE_CONFIG.path,
              path.resolve(process.cwd(), "node_modules"),
            ],
            use: [
              {
                loader: moduleLoader,
                options: {
                  module: MODULE_CONFIG,
                  mode: "development",
                },
              },
            ],
          },
        ],
      },
    };
    // this bit is the magic piece that ensures that only our module.rule above processes
    // files in the modules directory or from lwc. If we don't exlude our modules directory
    // then we end up handing off the compilation to the storybook defaults.
    customConfig.module.rules.forEach((rule) => {
      if (!rule.exclude) {
        rule.exclude = /(node_modules|modules|lwc)/;
      } else if (Array.isArray(rule.exclude)) {
        rule.exclude.push(/(node_modules|modules|lwc)/);
      }
    });
    serverConfig = webpackMerge.smart(serverConfig, customConfig);
    // this is the final magic piece which says how an module name should be loaded.
    // this means if we see `import MyApp from 'my/app'` then lwc resolve will look for it.
    // IMPORTANT: in lwc-services@2.1.0 you must declare you modules in package.json or lwc.config.json
    // this is a new part of the Module Resolution RFC: https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution
    const entryPaths = getWebpackEntryPaths(customConfig.entry);
    const lwcModuleResolver = {
      resolve: {
        extensions: [".js", ".ts", ".json"],
        alias: {
          lwc: require.resolve("@lwc/engine"),
          "@lwc/wire-service": require.resolve("@lwc/wire-service"),
        },
        plugins: [
          new ModuleResolver({
            module: MODULE_CONFIG,
            entries: entryPaths,
          }),
        ],
      },
    };
    serverConfig = webpackMerge.smart(serverConfig, lwcModuleResolver);
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
