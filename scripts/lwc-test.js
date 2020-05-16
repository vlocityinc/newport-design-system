#!/usr/bin/env node

const path = require('path');
const jest_version = require('jest/package.json').version;
const defaultConfig = require('@lwc/jest-preset');
const lwcVersion = require('lwc').getVersion();
const merge = require('deepmerge');
const arrayMerge = require('./arrayMerge');
const Mode = require('stat-mode');
const fs = require('fs');
const minimist = require('minimist');
const chalk = require('chalk');
const prettyjson = require('prettyjson-chalk');
const execa = require('execa');
const findup = require('find-up');

const package = require('../package.json');
const { readDefaultMapperFile } = require('../src/utils');

const currentVersion = package.version;

// We should probably just warn the user instead of changing file permissions
const _writeFileSync = fs.writeFileSync;

fs.writeFileSync = function(path, data, options) {
    if (path.includes('/__snapshots__/')) {
        try {
            fs.accessSync(path, fs.W_OK);
        } catch (e) {
            if (e.code !== 'ENOENT') {
                console.log(`Path ${path} was not writable. Flipping writable bit, and retrying.`);
                // ensure-write, then try again
                const stat = fs.statSync(path);
                const mode = new Mode(stat);
                mode.owner.write = true;
                fs.chmod(path, mode.toOctal());
            }
        }
    }
    return _writeFileSync(path, data, options);
};

async function test(src, debug, cb) {
    await exec({}, src, debug, cb);
}

async function updateSnapshot(src, debug, cb) {
    await exec({ updateSnapshot: true }, src, debug, cb);
}

async function exec(opt, src, debug, cb) {
    try {
        console.log(chalk`{cyan.bold.inverse lwc-test:} Using Jest version {yellow.bold v${jest_version}}`);
        console.log(chalk`{cyan.bold.inverse lwc-test:} Using lwc version {yellow.bold v${lwcVersion}}`);

        const filename = await findup('jest.json', { cwd: src[0] });
        let projectConfig = {};
        try {
            if (filename && fs.existsSync(filename)) {
                projectConfig = JSON.parse(fs.readFileSync(filename, 'utf8'));
                console.log(chalk`{cyan.bold.inverse lwc-test:} Loaded configuration ${filename}`);
            } else {
                console.log(
                    chalk`{cyan.bold.inverse lwc-test:} {red.bold     No jest.json found in any parent directory of ${src[0]}}`
                );
            }
        } catch (ignore) {
            console.log(`Could not read ${filename}:`);
            console.log(ignore);
        }
        if (!filename && src.length > 1) {
            console.log(
                chalk`{cyan.bold.inverse lwc-test:} {red You specified multiple paths, but I could not find a root directory. }`
            );
            process.exit(1);
        }
        const rootDir = filename ? path.dirname(filename) : src[0];
        console.log(chalk`{cyan.bold.inverse lwc-test:} Setting rootdir to ${rootDir}`);

        const runnerConfig = {
            //roots: [src],
            verbose: true,
            rootDir: rootDir,
            testPathIgnorePatterns: ['/node_modules/', '/target/'],
            modulePathIgnorePatterns: ['/target/'],
            transformIgnorePatterns: [
                '/node_modules/(?!(lightning-components-stubs/modules/lightning-stubs|lwc-testrunner/node_modules/lightning-components-stubs/modules/lightning-stubs)/)'
            ]
        };

        // bugfix
        defaultConfig.moduleFileExtensions = ['ts', 'js', 'html'];

        if (process.env.EXECUTE_CORE_TESTS) {
            const configPath = path.resolve(__dirname, '../scripts/execute-core-tests/jest-html-reporter.config.js');
            runnerConfig.reporters = require(configPath).jestHtmlReporterConfig;
        }

        const mergedConfig = merge.all([runnerConfig, defaultConfig, projectConfig], {
            arrayMerge: arrayMerge.mergeArrayUnique
        });

        // Add defaults last since they should be considered last during module resolution. We also
        // avoid overriding existing entries because these are defaults.
        const defaultMapperFile = readDefaultMapperFile(src[0]);
        if (defaultMapperFile !== null) {
            Object.keys(defaultMapperFile).forEach(key => {
                if (!mergedConfig.moduleNameMapper[key]) {
                    mergedConfig.moduleNameMapper[key] = defaultMapperFile[key];
                }
            });
        }

        const pathToMockPackage = path.dirname(require.resolve('lightning-components-stubs/package.json'));
        const pathToMocks = pathToMockPackage + '/modules/lightning-stubs/core/$1/$1';
        const defaultMockKey = '^lightning/(.+)$';
        if (!mergedConfig.moduleNameMapper[defaultMockKey]) {
            mergedConfig.moduleNameMapper[defaultMockKey] = pathToMocks;
        }

        const options = {
            config: mergedConfig
            //env: require.resolve('environment-node-jsdom'),
        };
        if (debug) {
            options.runInBand = true;
        }
        Object.assign(options, opt);
        console.log(chalk`{cyan.bold.inverse lwc-test:} Merged configuration (in yaml format):`);

        let rendered = prettyjson.render(options, { keysColor: 'cyan' });
        rendered = rendered
            .split('\n')
            .map(s => chalk`{cyan.bold.inverse lwc-test:} ${s}`)
            .join('\n');
        console.log(rendered);

        // equivalent jest command
        const cmd = debug ? 'node' : 'jest';
        const display_cmd = debug ? 'node' : path.resolve(path.join(__dirname, '../node_modules/.bin/jest'));
        const args = [];
        if (debug) {
            console.log(
                chalk`{cyan.bold.inverse lwc-test:} {white.bold.inverse **** NOTICE **** When debugging tests, if you'd like Chrome to automatically open}`
            );
            console.log(
                chalk`{cyan.bold.inverse lwc-test:} {white.bold.inverse Install https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj}`
            );
            args.push('--inspect-brk');
            args.push(path.resolve(path.join(__dirname, '../node_modules/.bin/jest')));
            args.push('--runInBand');
        }
        args.push(...opt.passthru);
        delete opt.passthru;

        Object.keys(opt).forEach(o => {
            args.push(`--${o}`);
        });
        //TODO: annoying: displayArgs needs a quoted (') json object, but execa can't have it
        const displayArgs = [...args];

        args.push('--config');
        args.push(`${JSON.stringify(mergedConfig)}`);
        //args.push('--showConfig');
        args.push(...src);

        displayArgs.push('--config');
        displayArgs.push(`'${JSON.stringify(mergedConfig)}'`);
        //args.push('--showConfig');
        displayArgs.push(...src);

        console.log(
            chalk`{cyan.bold.inverse lwc-test:} Launching jest command \n{cyan.dim ${display_cmd} ${displayArgs.join(
                ' '
            )}}\n`
        );

        const jest = execa(cmd, args, {
            localDir: __dirname,
            preferLocal: true,
            stdio: 'inherit'
        });
        jest.then(() => {
            console.log(chalk`{cyan.bold.inverse lwc-test:} 😌  Jest tests successful!`);
        }).catch(result => {
            console.log(
                chalk`{cyan.bold.inverse lwc-test:} 😢  Jest execution returned non-zero exit code ${result.exitCode}`
            );
            process.exit(result.exitCode);
        });
    } catch (e) {
        console.error(e);
        cb(e);
    }
}
function printUsage() {
    console.log(chalk`{cyan.bold.inverse lwc-test:} lwc-test version {yellow.bold v${currentVersion}}`);
    const usage = chalk`
  {bold Usage: lwc-test [--updateSnapshot] [--debug] [paths...] [-- <passthruArgs>]}

  Will launch Jest with a configuration that includes LWC support. Default config
  can be overridden using jest.json.

  Any args that appear after '{bold  -- }' are passed directly to the underlying Jest
  command. See https://facebook.github.io/jest/docs/en/cli.html

  {bold Options:}
    --updateSnapshot    Use this flag to re-record every snapshot that fails during
                        this test run.
    --debug             Run test using chrome inspector
    --help              Print this help and exit


  The Jest {bold <rootDir>} will be automatically set to the folder that contains
  {bold jest.json}. It will look for {bold jest.json} starting at the specified path (or current
  directory if unspecified) and looking in all parent paths. If it can not be found,
  it will be set to the current directory.

  If you do not specify a path, it will run all tests it finds under the {bold <rootDir>}.
  If would like to limit the tests to the current directory, you can invoke:

    {bold lwc-test .}

  You can also specify multiple paths via a glob pattern. In this case, there
  must be a {bold jest.json} somewhere in one of the parent directories, or else
  its not possible to determine a common {bold <rootDir>}, and the command will fail.

  {bold See more help at https://git.soma.salesforce.com/lwc/lwc-testrunner}
  `;
    console.log(usage);
}

function run() {
    const argv = process.argv.slice(2);
    var min = minimist(argv, {
        '--': true,
        boolean: ['debug', 'updateSnapshot']
    });
    if (min.help) {
        printUsage();
        process.exit(1);
    }
    console.log(chalk`{cyan.bold.inverse lwc-test:} lwc-test version {yellow.bold v${currentVersion}}`);
    console.log(chalk`{cyan.bold.inverse lwc-test:} {white.bold     Use --help to get help on options}`);

    const dir = min._.map(p => path.resolve(path.normalize(p)));

    const opts = {};
    if (min.debug) {
        console.log(chalk`{cyan.bold.inverse lwc-test:} Launching tester in debug mode as a seperate process. `);
    }
    if (min.updateSnapshot) {
        opts.updateSnapshot = true;
    }
    opts.passthru = min['--'];
    exec(opts, dir, min.debug, () => {});
}

if (require.main === module) {
    run();
}

module.exports = {
    test: test,
    run: run,
    updateSnapshot: updateSnapshot
};
