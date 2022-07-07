const { parseString } = require('xml2js');
const { resolve } = require('path');
const { argv } = require('yargs');
const prettier = require('prettier');
const prettierConfig = require('../../.prettierrc');
const fs = require('fs');
const os = require('os');

/**
 * Update labels from sfdc and output them as js files for our off core repo.
 * Any new labels added to a *.xml need to run this in order to have them show up in off core
 * Also update the label-en.json which is packaged with the generated npm package
 *
 * Example usage:
 * node update-labels.js --labelFile ~/blt/app/main/core/shared-labels/java/resources/sfdc/i18n/shared_core_ui_labels/builderframework.xml --targetDir ../../packages/flow-builder-pocs/src/demo-app/labels/ --jsonDir ../../labels/
 */

const xmlPath =
    argv.labelFile ||
    '~/blt/app/main/core/shared-labels/java/resources/sfdc/i18n/shared_core_ui_labels/builderframework.xml';
const targetDir = argv.targetDir || '../../packages/flow-builder-pocs/src/demo-app/labels/';
const jsonDir = argv.jsonDir || '../../labels/';

if (!xmlPath || !targetDir) {
    throw new Error('Missing required options: --labelFile or --targetDir');
}
generateLabels(xmlPath, targetDir);

function generateLabels(labelXmlPath, target) {
    labelXmlPath = labelXmlPath.replace('~', os.homedir());
    const labelXml = fs.readFileSync(resolve(labelXmlPath)).toString();
    const labelsJson = {};

    parseString(labelXml, (err, data) => {
        data.iniFile.section.forEach((section) => {
            const sectionName = section.$.name;
            section.param.forEach((param) => {
                const paramName = param.$.name;
                const paramValue = param._;

                // Escape single quotes
                const escapedParamValue = paramValue ? paramValue.replace(/'/g, "\\'") : paramValue;
                if (!labelsJson.hasOwnProperty(sectionName)) {
                    labelsJson[sectionName] = {};
                }
                labelsJson[sectionName][paramName] = paramValue;

                const targetFile = resolve(target, `${sectionName}.${paramName}.js`);
                const fileData = prettier.format(`export default '${escapedParamValue}';`, {
                    ...prettierConfig,
                    parser: 'babel'
                });
                fs.writeFileSync(targetFile, fileData);
            });
        });
    });

    fs.writeFileSync(
        resolve(jsonDir, 'labels-en.json'),
        prettier.format(JSON.stringify(labelsJson), { parser: 'json' })
    );
}
