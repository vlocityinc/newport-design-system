// Courtesy of lightning global components https://git.soma.salesforce.com/aura/lightning-global/blob/master/ui-lightning-components/scripts/generateNpmPackage.js
// -- Libraries ----
const fs = require('fs-extra');
const path = require('path');

// -- Paths -------
const rootPath = path.join(__dirname, '../');
const distPath = path.join(rootPath, 'dist/builder-platform-interaction-components');
const fixturesPath = path.join(__dirname, 'npm-package-fixtures');
const labels = require(path.join(rootPath, 'labels/labels-en.json'));

// -- Config -------
const packageJson = require(path.join(fixturesPath, 'package.json'));
const packageVersion = require(path.join(rootPath, 'lerna.json')).version;

// -- Build NPM Package -------

// Reset dir
fs.emptyDirSync(distPath);
fs.emptyDirSync(path.join(distPath, 'scopedImports'));

// Copy component sources
const modulesSrc = path.join(distPath, '/src/builder_platform_interaction');
fs.copySync(path.join(rootPath, 'src/main/modules/builder_platform_interaction'), modulesSrc, {
    filter: modulePath => {
        return modulePath.indexOf('__raptorMocks__') === -1;
    }
});

// Add external dependencies

packageJson.version = `${packageVersion}`;

fs.writeFileSync(path.join(distPath, 'package.json'), JSON.stringify(packageJson, null, '  '), 'utf8');

writeToConfigFile({
    labels,
    configFilePath: path.join(distPath, 'package.json'),
    resourcesPath: path.join(distPath, 'scopedImports')
});

function writeToConfigFile(config) {
    const { configFilePath, resourcesPath, labels } = config;

    // first need to generate the import files
    const resolveMap = getResolutionMap({ labels });
    createImportFiles(resolveMap, resourcesPath);

    const lwcConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    const relativeResourcesPath = path.relative(path.dirname(configFilePath), resourcesPath);

    const resolutionMap = {};
    Object.keys(resolveMap).forEach(key => {
        const filename = path.join(relativeResourcesPath, resolveFilename(key));
        resolutionMap[key] = filename;
    });
    // TODO: Do this in a better way - remove old import map and put in the new one
    if (lwcConfig.lwc.modules.length > 1) {
        lwcConfig.lwc.modules.pop();
    }
    lwcConfig.lwc.modules.push(resolutionMap);
    fs.writeFileSync(path.resolve(configFilePath), JSON.stringify(lwcConfig, null, '    '), 'utf8');
}

function createImportFiles(resolveMap, resourcesPath) {
    const filePaths = [];
    fs.ensureDirSync(resourcesPath);

    Object.keys(resolveMap).forEach(key => {
        const filePath = writeToFile(resolveMap, key, resourcesPath);
        filePaths.push(filePath);
    });
    return filePaths;
}

/**
 * return a resolution Map for LWC components(only labels for now) such that
 * {
 *   @salesforce/label/{sectionName}/{paramName} : {paramValue}
 *   ...
 * }
 * @param labels
 */
function getResolutionMap({ labels }) {
    return createLabelMap(labels);
}

function createLabelMap(labels) {
    const labelsMap = {};
    for (const sectionName in labels) {
        for (const paramName in labels[sectionName]) {
            labelsMap[`@salesforce/label/${sectionName}.${paramName}`] = labels[sectionName][paramName];
        }
    }
    return labelsMap;
}

function resolveFilename(key) {
    return `${key.replace(/\//g, '-')}.js`;
}

function writeToFile(map, importee, resourcesPath) {
    const filename = resolveFilename(importee);
    const filePath = path.join(resourcesPath, `/${filename}`);
    // Escape single quotes within the label text, if any
    const labelText = `${map[importee]}`.replace("'", "\\'");
    // export default 'It\'s an error.';
    fs.writeFileSync(filePath, `export default '${labelText}';`);
    return filePath;
}
