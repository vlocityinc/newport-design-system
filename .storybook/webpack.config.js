require('@babel/register');

const path = require('path');
const gulp = require('gulp');
const NewportSassWatcherPlugin = require('./sass-watcher-plugin');

require('../scripts/gulp/styles');

// Export a function. Accept the base config as the only param.
module.exports = async ({ customConfig, mode }) => {
  const MODULE_CONFIG = {
    path: path.resolve('src/modules'),
  };
  // // this part tells Webpack which files to the LWC module loader on
  // // it'll match all js, ts, html and css files in the `src/modules` directory
  // // but it'll exclude anything named `*.stories.js/ts` in those directories.
  let serverConfig = {
    module: {
      rules: [
        {
          test: /\.(js|ts|html|css)$/,
          include: [
            MODULE_CONFIG.path,
            path.resolve(process.cwd(), 'node_modules'),
          ],
          use: [
            {
              loader: moduleLoader,
              options: {
                module: MODULE_CONFIG,
                mode: 'development',
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
      rule.exclude = /(node_modules|modules)/;
    } else if (Array.isArray(rule.exclude)) {
      rule.exclude.push(/(node_modules|modules)/);
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
      extensions: ['.js', '.ts', '.json'],
      alias: {
        lwc: require.resolve('@lwc/engine'),
        '@lwc/wire-service': require.resolve('@lwc/wire-service'),
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
  serverConfig.module.rules.push({
    test: /\.(scss|yml)$/,
    loaders: ['raw-loader'],
    include: path.resolve(__dirname, '../'),
  });

  serverConfig.module.rules.push({
    // 2a. Load `.stories.mdx` / `.story.mdx` files as CSF and generate
    //     the docs page from the markdown
    test: /\.(stories|story)\.mdx$/,
    use: [
      {
        loader: 'babel-loader',
        // may or may not need this line depending on your app's setup
        options: {
          plugins: ['@babel/plugin-transform-react-jsx'],
        },
      },
      {
        loader: '@mdx-js/loader',
        options: {
          compilers: [createCompiler({})],
        },
      },
    ],
  });

  serverConfig.module.rules.push({
    test: /\.(stories|story)\.[tj]sx?$/,
    loader: require.resolve('@storybook/source-loader'),
    exclude: [/node_modules/],
    enforce: 'pre',
  });

  serverConfig.plugins.push(new NewportSassWatcherPlugin());
  // Sass
  gulp.series('styles:framework')();
  // mock fs for comment parser
  serverConfig.node = {
    fs: 'empty',
  };
  return serverConfig;
};
