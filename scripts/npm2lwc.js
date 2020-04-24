const { resolve, basename, dirname, relative } = require('path');
const fs = require('fs');
const { copySync, ensureDirSync, removeSync } = require('fs-extra');
const argv = require('yargs').argv;
const { transformFileSync } = require('@babel/core');
const transformNamespace = require('./babel/babel-plugin-npm2lwc/index');
const {
    camelCase,
    findAllPackages,
    printWarning,
    printInfo,
    printError,
    printSuccess,
    printHeader,
    getDirectories
} = require('./utils');
const watch = require('node-watch');

const modulesArg = argv._[0] || 'src/main/modules';
const npmPackagesArg = argv._[1] || 'packages'; // force passing in args for now

const baseDir = process.cwd();
const modulePath = resolve(baseDir, modulesArg);

npm2lwc(modulePath, npmPackagesArg, argv);

/**
 * "Transpiles" a built npm monorepo package into a core ui-tier module of lwc components
 *
 * Usage: node npm2lwc.js <npmPackagesLocation> <uiModuleLocation>
 *
 * Will only run on packages that contain the "npm2lwc" package configuration. If no configuration needed, set to true or empty object
 *
 * Example configuration:
 * package.json
 *    "npm2lwc": {
 *      "deployToCore": boolean // Deploy package to core if set to true when run with core flag | default to false
 *      "namespace": string // Core namespace of package | default to builder_platform_interaction
 *      "name": string // Core name of package | default to camel case of current package
 *      "dist": string // Path to distribution file. Must be rolled into one file. | default dist/index.esNext.js
 *    }
 *
 * Following assumption made here:
 *      - Package lwc code is all rolled up into dist/index.esNext.js unless overridden
 *      - Any dependencies on external packages outside of monorepo need to be included in the rollup
 *      - If types exist then those are found rolled into dist/index.d.ts
 *
 * @param npmPackagesPath
 * @param coreModulePath
 * @param options {core, watch}
 */
function npm2lwc(npmPackagesPath, coreModulePath, options) {
    if (!fs.existsSync(coreModulePath)) {
        fs.mkdirSync(coreModulePath, { recursive: true });
    }
    const foundPkgs = findAllPackages(npmPackagesPath);

    if (options.watch) {
        printHeader(`Watching files in ${npmPackagesPath}.`);
        process.setMaxListeners(foundPkgs.length);
    } else {
        printHeader(`Exporting NPM packages in ${npmPackagesPath} to ${coreModulePath}`);
    }

    const npm2lwcNameMap = {};

    // Deploying to core so remove LWC scoping
    if (options.core) {
        npm2lwcNameMap['@lwc/wire-service'] = 'wire-service';
    }

    // Build out map from npm package name to LWC equivalent
    foundPkgs.forEach(pkgPath => {
        const packageJson = require(resolve(pkgPath, 'package.json'));
        const npm2lwcConfig = packageJson.npm2lwc;
        if (npm2lwcConfig) {
            const pkgName = relative(npmPackagesPath, pkgPath);
            // Check for module name override in package.json sfdc property, otherwise default to camelCase of package name
            const moduleName = npm2lwcConfig.name || camelCase(basename(pkgPath));
            // Check for namespace override in package.json sfdc property, otherwise default to builder_platform_interaction
            const namespace = npm2lwcConfig.namespace || 'builder_platform_interaction';
            npm2lwcNameMap[pkgName] = `${namespace}/${moduleName}`;
        }
    });

    foundPkgs.forEach(pkgPath => {
        const npm2lwcConfig = require(resolve(pkgPath, 'package.json')).npm2lwc;
        if (npm2lwcConfig) {
            const pkg = relative(npmPackagesPath, pkgPath);
            if (npm2lwcConfig.ui) {
                mvUiModule(resolve(npmPackagesPath, pkg), coreModulePath, options);
            } else {
                if (options.core && !npm2lwcConfig.deployToCore) {
                    printWarning(`Core deployment skipped for ${basename(pkgPath)}`);
                    return;
                }
                exportPackageToLwcModule(npmPackagesPath, pkg, coreModulePath, npm2lwcNameMap, options);
            }
        } else {
            printWarning(`Npm2lwc config not set: Skipped for ${basename(pkgPath)}`);
        }
    });
}

function exportPackageToLwcModule(packageRootPath, pkg, modulesPath, npm2lwcNameMap, options) {
    const packagePath = resolve(packageRootPath, pkg);
    const packageName = basename(packagePath);

    const npm2lwcConfig = require(resolve(packagePath, 'package.json')).npm2lwc;

    const fqn = npm2lwcNameMap[pkg];
    const moduleName = basename(fqn);

    const modulePath = resolve(modulesPath, fqn);
    const sourcePath = resolve(packagePath, npm2lwcConfig.dist || 'dist/index.esNext.js');

    const lwcSourcePath = resolve(modulePath, `${moduleName}.js`);

    if (options.watch) {
        if (!fs.existsSync(sourcePath)) {
            return;
        }

        fs.watchFile(sourcePath, () => {
            printInfo(`File change detected at ${sourcePath}. Pushing changes to ${lwcSourcePath}`);
            if (fs.existsSync(lwcSourcePath)) {
                fs.unlinkSync(lwcSourcePath);
            }
            writePackageToLwcModule(lwcSourcePath, sourcePath, npm2lwcNameMap);
        });
    } else {
        printInfo(`${pkg}: Transpiling to ${fqn}`);

        if (fs.existsSync(modulePath)) {
            removeSync(modulePath);
        }
        ensureDirSync(modulePath);

        writeMetaXMLFile(dirname(lwcSourcePath));

        if (!fs.existsSync(sourcePath)) {
            printWarning(`${packageName}: Source file missing. Expected to be in ${sourcePath}`);
            return;
        }

        writePackageToLwcModule(lwcSourcePath, sourcePath, npm2lwcNameMap);
    }
    // Copy typings if exists
    const typingsSrcPath = resolve(packagePath, 'build/types/index.d.ts');
    if (fs.existsSync(typingsSrcPath)) {
        fs.copyFileSync(typingsSrcPath, resolve(modulePath, `${moduleName}.d.ts`));
    }
}

function mvUiModule(src, dest, options) {
    const npm2lwcConfig = require(resolve(src, 'package.json')).npm2lwc;
    const sourcePath = resolve(src, 'src/');
    if (options.watch) {
        watch(sourcePath, { recursive: true }, (event, filename) => {
            if (event === 'update') {
                // on create or modify
                // Check not a temp file generated (intellij)
                if (filename.indexOf('___') === -1 && !filename.endsWith('~') && !filename.endsWith('.tmp')) {
                    const fullSourcePath = resolve(sourcePath, filename);
                    const relativePath = relative(sourcePath, fullSourcePath);
                    const modulePath = resolve(dest, relativePath);
                    printInfo(`File change detected at ${fullSourcePath}`);
                    try {
                        fs.copyFileSync(fullSourcePath, modulePath);
                        printSuccess(`Pushed changes to ${modulePath} (${new Date(Date.now()).toLocaleString()})`);
                    } catch (e) {
                        printError(`Could not copy file at ${fullSourcePath}: ${e.message}`);
                    }
                }
            }
        });
    } else {
        printHeader(`Moving UI modules in ${sourcePath} to ${dest}`);
        copySync(sourcePath, dest, {
            // TODO: remove this hardcoded filter
            filter: src => !src.endsWith('flowUtils.js')
        });

        // TODO: Remove. Do not expose every ui cmp by default, Can remove namespace from ui package src path
        const uiDest = resolve(dest, npm2lwcConfig.namespace);
        const dirs = getDirectories(uiDest);
        let dir, modulePath;
        for (let i = 0; i < dirs.length; i++) {
            dir = dirs[i];
            modulePath = resolve(uiDest, dir);
            writeMetaXMLFile(modulePath);
            /* For ui components with npm style importing TBD
            fs.readdirSync(modulePath).forEach(file => {
                if (file.endsWith('.js')) {
                    const jsSrc = resolve(modulePath, file);
                    printInfo(`Transpiling : ${jsSrc}`);
                    writePackageToLwcModule(jsSrc, jsSrc, packageNamespace, lwcNamespace);
                }
            });
    */
        }
    }
}

function writePackageToLwcModule(lwcSourcePath, sourcePath, packageNameMap) {
    fs.writeFileSync(lwcSourcePath, transformPackageNamespaceToLWC(sourcePath, packageNameMap), { flag: 'w' });
}

/**
 * Transform import statements from file found at sourcePath to lwc compatible
 * @param sourcePath
 * @param nameMapper
 * @return {*} Result of the transformation code
 */
function transformPackageNamespaceToLWC(sourcePath, nameMapper) {
    return transformFileSync(sourcePath, {
        plugins: [
            transformNamespace({
                nameMapper
            })
        ]
    }).code;
}

/**
 * Create default metaXml file as exposed.
 *
 * TODO: Allow packages to point to custom meta xml and pull from path.
 * FIXME: Do not expose by default.
 * @param modulePath path to copy meta-xml file to
 * @param sourcePath path to source meta xml code
 */
function writeMetaXMLFile(modulePath, sourcePath) {
    const filename = `${basename(modulePath)}.js-meta.xml`;
    const targetPath = resolve(modulePath, filename);
    if (!sourcePath) {
        fs.writeFileSync(
            targetPath,
            `<LightningComponentBundle xmlns="xmlns=http://soap.sforce.com/2006/04/metadata"><isExposed>true</isExposed></LightningComponentBundle>`
        );
    }
}
