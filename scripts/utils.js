const { resolve, join } = require('path');
const chalk = require('chalk');
const fs = require('fs');

function camelCase(s) {
    return s.replace(/-[a-zA-Z]/gi, (match) => {
        return match.charAt(1).toUpperCase();
    });
}

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter((file) => fs.statSync(join(srcPath, file)).isDirectory());
}

const print = (msg, chalkColor) => {
    console.log(chalkColor(msg));
};
const log = console.log;
const printInfo = (msg) => print.bind(null, msg, chalk.cyan)();
const printWarning = (msg) => print.bind(null, msg, chalk.yellow)();
const printError = (msg) => print.bind(null, msg, chalk.red)();
const printHeader = (msg) => print.bind(null, msg, chalk.blue)();
const printSuccess = (msg) => print.bind(null, msg, chalk.green)();

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
    getDirectories,
    log,
    printInfo,
    printWarning,
    printError,
    printHeader,
    printSuccess,
    findAllPackages
};
