require('dotenv').config();
const xml2js = require('xml2js');
const { usage } = require('yargs');
const fs = require('fs');
const { log, printError, printSuccess, printHeader, printInfo } = require('./utils');
const P4 = require('p4api').P4;
const DEFAULT_P4PORT = 'ssl:p4proxy.soma.salesforce.com:1999';
const chalk = require('chalk');

/**
 * Defines p4api P4's P4PORT (see @{link https://www.npmjs.com/package/p4api#contructor}), first found based on the given checks order
 * 1 - process.env.P4PORT
 * 2 - .env file CUSTOM_P4PORT entry (ie: available in process.env via dotenv @{link https://www.npmjs.com/package/dotenv} )
 * 3 - DEFAULT_P4PORT fallback "generic" P4PORT (ie: ssl:p4proxy.soma.salesforce.com:1999)
 */
const getP4Port = ({ env }) => (env.P4PORT ? env.P4PORT : env.CUSTOM_P4PORT ? env.CUSTOM_P4PORT : DEFAULT_P4PORT);

const p4 = new P4({ P4PORT: getP4Port(process) });

const POM_PROPERTIES_TO_CHECK = {
    'aura.version': 'auraVersion',
    'lwc.api.version': 'lwcApiVersion',
    'lwc.version': 'lwcVersion'
};

const getPomProperty = (property, pomAsJson) => pomAsJson.project.properties[0][property][0];
const getCorePomProperties = async (branch) => {
    return p4.cmd(`print -q //app/${branch}/core/pom.xml`).then((p4Response) => {
        if (p4Response.error) {
            throw Error(p4Response.error[0].data);
        }
        return getPropertiesFromPom(p4Response.data);
    });
};
const getPropertiesFromPom = async (pomXml) => xml2js.parseStringPromise(pomXml);
const getProjectPomProperties = async () => {
    const pomXml = fs.readFileSync('pom.xml', 'utf-8');
    return getPropertiesFromPom(pomXml);
};

const checkProperty = (property, projectPomProperties, corePomProperties) => {
    const projectPropertyValue = getPomProperty(property, projectPomProperties);
    const corePropertyValue = getPomProperty(property, corePomProperties);
    if (projectPropertyValue !== corePropertyValue) {
        return {
            'Property name': property,
            'Project version': projectPropertyValue,
            'Core version': corePropertyValue
        };
    }
    return undefined;
};

/**
 * Check if project pom.xml properties are in sync with whats in core
 * @param {string} branch  - branch to be checked against (eg: main)
 * @returns {Promise<void>}
 */
const checkProjectPomProperties = async (branch) => {
    try {
        const projectPomProperties = await getProjectPomProperties();
        const corePomProperties = await getCorePomProperties(branch);

        printHeader('Checking pom properties');
        const propertiesNotInSync = Object.keys(POM_PROPERTIES_TO_CHECK)
            .map((property) => checkProperty(property, projectPomProperties, corePomProperties))
            .filter(Boolean);

        const hasPropertiesNotInSync = propertiesNotInSync.length > 0;
        if (hasPropertiesNotInSync) {
            printError('The following properties are out of sync with core:');
            console.table(propertiesNotInSync);
            printError('Run `yarn update:syncPomToCore` to update.\n');
        } else {
            printSuccess('pom.xml in sync with core');
        }
        process.exit(hasPropertiesNotInSync ? 1 : 0);
    } catch (e) {
        printError(`Error while checking pom properties : ${e.message}`);
        process.exit(1);
    }
};

/**
 * @param {string} branch - branch to be checked against (eg: main)
 */

/**
 * Syncs project pom.xml properties with what is in core
 * @param {string} branch - branch to be checked against (eg: main)
 * @returns {Promise<boolean>} fulfilled Promise with returned value true if any updates applied
 * @throws error if no version found for given property
 */
const updatePom = async (branch) => {
    const corePomProperties = await getCorePomProperties(branch);
    let currentPom = fs.readFileSync('pom.xml').toString();
    let hasSomePomUpdates = false;
    Object.keys(POM_PROPERTIES_TO_CHECK).forEach((propertyName) => {
        const propertyCoreValue = getPomProperty(propertyName, corePomProperties);
        printHeader(`Syncing ${propertyName} ...`);
        const pomPropertyRegex = RegExp(`<${propertyName}>(.+)</${propertyName}>`);
        const propertyMatch = pomPropertyRegex.exec(currentPom);
        if (!propertyMatch) {
            throw new Error(`Could not get version from pom.xml for "${propertyName}"`);
        }
        const currentPomPropertyValue = propertyMatch[1];
        if (currentPomPropertyValue !== propertyCoreValue) {
            log(
                chalk.green(
                    'Updating',
                    chalk.bold(`${propertyName}`),
                    'from',
                    chalk.bold(`${currentPomPropertyValue}`),
                    'to',
                    chalk.green.bold(`${propertyCoreValue}`)
                )
            );
            currentPom = currentPom.replace(
                pomPropertyRegex,
                `<${propertyName}>${propertyCoreValue}</${propertyName}>`
            );
            hasSomePomUpdates = true;
        } else {
            printInfo(`${propertyName} left unchanged (${currentPomPropertyValue})`);
        }
        if (hasSomePomUpdates) {
            fs.writeFileSync('pom.xml', Buffer.from(currentPom));
        }
    });
    return hasSomePomUpdates;
};

usage('Usage: $0 [options]')
    .command(
        ['sync'],
        'Sync pom.xml properties with what is in core',
        () => {},
        (argv) => {
            updatePom(argv.branch)
                .then((hasSomeUpdates) => {
                    printSuccess(`\nSuccessfully ${hasSomeUpdates ? 'updated' : 'synced'} pom.xml`);
                })
                .catch((e) => {
                    printError(`\nFailed to sync pom.xml: ${e.message}`);
                    process.exit(1);
                });
        }
    )
    .command(
        ['check'],
        `Check if pom.xml properties are in sync with what is in core`,
        () => {},
        (argv) => {
            checkProjectPomProperties(argv.branch);
        }
    )
    .alias('b', 'branch')
    .nargs('b', 1)
    .describe('b', 'branch ("main", "226/patch" ...)')
    .demandOption(['b'])
    .help('h')
    .alias('h', 'help').argv;
