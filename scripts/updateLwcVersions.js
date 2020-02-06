const { resolve, basename } = require('path');
const fs = require('fs');
const prettier = require('prettier');
const { findAllPackages, printInfo } = require('./utils');
const argv = require('yargs').argv;
const lwcDependencyRegex = /\@lwc\//;

const src = argv.src || '.';

updateLwcVersion(resolve(process.cwd(), src));

/**
 * Scans the repo from the root package downward for all other packages and
 * updates the lwc version to the version specified in the root npm config
 *
 * @param rootPackageDir
 */
function updateLwcVersion(rootPackageDir) {
    const rootPackage = require(resolve(rootPackageDir, 'package.json'));
    const lwcVersion = rootPackage.config.lwcVersion;
    printInfo(`Updating @lwc packages to version ${lwcVersion}`);

    const packages = findAllPackages(rootPackageDir);

    packages.forEach(path => {
        updatePackageLwcVersion(path, lwcVersion);
    });
}

function updatePackageLwcVersion(packagePath, lwcVersion) {
    const packageJsonPath = resolve(packagePath, 'package.json');
    const packageJson = require(packageJsonPath);

    let writeFile = false;
    const updateLwcDependencies = dependencies => {
        for (const depName in dependencies) {
            if (dependencies.hasOwnProperty(depName)) {
                if (depName.match(lwcDependencyRegex)) {
                    if (dependencies[depName] !== lwcVersion) {
                        writeFile = true;
                        dependencies[depName] = lwcVersion;
                    }
                }
            }
        }
        return dependencies;
    };

    // update dependencies
    if (packageJson.dependencies) {
        packageJson.dependencies = updateLwcDependencies(packageJson.dependencies);
    }

    // update devDependencies
    if (packageJson.devDependencies) {
        packageJson.devDependencies = updateLwcDependencies(packageJson.devDependencies);
    }

    if (writeFile) {
        printInfo(`Updating @lwc dependencies for: ${basename(packagePath)}`);
        fs.writeFileSync(packageJsonPath, prettier.format(JSON.stringify(packageJson), { parser: 'json' }));
    }
}
