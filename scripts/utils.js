const { resolve, join } = require('path');
const chalk = require('chalk');
const fs = require('fs');

function camelCase(s) {
    return s.replace(/-[a-zA-Z]/gi, match => {
        return match.charAt(1).toUpperCase();
    });
}

function deleteFolder(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(file => fs.statSync(join(srcPath, file)).isDirectory());
}
function printInfo(msg) {
    console.log(`\x1b[36mINFO\x1b[0m: ${msg}`);
}

function printWarning(msg) {
    console.log(`\x1b[33m(!) WARN\x1b[0m: ${msg}`);
}

function printError(msg) {
    console.log(`\x1b[31m(!) ERROR\x1b[0m: ${msg}`);
}

function isPackage(testPath) {
    const packageJsonPath = resolve(testPath, 'package.json');
    return fs.existsSync(packageJsonPath);
}

function findAllPackages(currentDir) {
    let pkgs = [];
    if (isPackage(currentDir)) {
        pkgs.push(currentDir);
    }
    const dirs = getDirectories(currentDir);
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        if (dir === 'node_modules') {
            continue;
        }
        const dirPath = join(currentDir, dir);
        if (isPackage(dirPath)) {
            pkgs.push(dirPath);
        } else {
            const nestedPkgs = findAllPackages(dirPath);
            pkgs = pkgs.concat(nestedPkgs);
        }
    }
    return pkgs;
}

module.exports = {
    camelCase,
    deleteFolder,
    getDirectories,
    printInfo,
    printWarning,
    printError,
    isPackage,
    findAllPackages
};
