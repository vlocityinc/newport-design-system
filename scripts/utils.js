const { resolve, join } = require('path');
const chalk = require('chalk');
const fs = require('fs');
const xml2js = require('xml2js');
const P4 = require('p4api').P4;
const p4 = new P4();

function getPomProperty(property, pomAsJson) {
    return pomAsJson.project.properties[0][property][0];
}

async function getCorePomProperties() {
    return p4.cmd('print -q //app/main/core/pom.xml').then(p4Response => {
        if (p4Response.error) {
            throw Error(p4Response.error[0].data);
        }
        return getPropertiesFromPom(p4Response.data);
    });
}

async function getPropertiesFromPom(pomXml) {
    return xml2js.parseStringPromise(pomXml);
}

async function getProjectPomProperties() {
    const pomXml = fs.readFileSync('pom.xml', 'utf-8');
    return getPropertiesFromPom(pomXml);
}

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

const POM_PROPERTIES_TO_CHECK = ['lwc.api.version', 'aura.version', 'lwc.version'];

module.exports = {
    camelCase,
    deleteFolder,
    getDirectories,
    printInfo,
    printWarning,
    printError,
    isPackage,
    findAllPackages,
    getPomProperty,
    getCorePomProperties,
    getProjectPomProperties,
    POM_PROPERTIES_TO_CHECK
};
