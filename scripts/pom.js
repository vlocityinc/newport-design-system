const exec = require('await-exec');
require('dotenv').config();
const xml2js = require('xml2js');
const { usage } = require('yargs');
const fs = require('fs');
const { printError, printSuccess, printHeader } = require('./utils');
const P4 = require('p4api').P4;
const DEFAULT_P4PORT = 'ssl:p4proxy.soma.salesforce.com:1999';

/**
 * Defines p4api P4's P4PORT (see @{link https://www.npmjs.com/package/p4api#contructor}), first found based on the given checks order
 * 1 - process.env.P4PORT
 * 2 - .env file CUSTOM_P4PORT entry (ie: available in process.env via dotenv @{link https://www.npmjs.com/package/dotenv} )
 * 3 - DEFAULT_P4PORT fallback "generic" P4PORT (ie: ssl:p4proxy.soma.salesforce.com:1999)
 */
const getP4Port = ({ env }) => (env.P4PORT ? env.P4PORT : env.CUSTOM_P4PORT ? env.CUSTOM_P4PORT : DEFAULT_P4PORT);

const p4 = new P4({ P4PORT: getP4Port(process) });

const POM_PROPERTIES_TO_CHECK = ['lwc.api.version', 'aura.version', 'lwc.version'];

function getPomProperty(property, pomAsJson) {
    return pomAsJson.project.properties[0][property][0];
}

async function getCorePomProperties(branch) {
    return p4.cmd(`print -q //app/${branch}/core/pom.xml`).then(p4Response => {
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

function checkProperty(property, projectPomProperties, corePomProperties) {
    const projectValue = getPomProperty(property, projectPomProperties);
    const coreValue = getPomProperty(property, corePomProperties);
    if (projectValue !== coreValue) {
        printError(`${property} is out of sync with core: ${coreValue} vs ${projectValue}`);
        return property;
    }
    return undefined;
}

/**
 * Check if project pom.xml properties are in sync with whats in core
 * @param {string} branch  - branch to be checked against (eg: main)
 * @returns {Promise<void>}
 */
async function checkProjectPomProperties(branch) {
    try {
        const projectPomProperties = await getProjectPomProperties();
        const corePomProperties = await getCorePomProperties(branch);

        printHeader('Checking pom properties');
        const propertiesNotInSync = POM_PROPERTIES_TO_CHECK.map(property =>
            checkProperty(property, projectPomProperties, corePomProperties)
        ).filter(Boolean);

        const hasErrors = propertiesNotInSync.length > 0;

        if (hasErrors) {
            printError('\nEdit pom.xml and update.');
        } else {
            printSuccess('pom.xml in sync with core');
        }
        process.exit(hasErrors ? 1 : 0);
    } catch (e) {
        printError(`Error while checking pom properties : ${e.message}`);
        process.exit(1);
    }
}

/**
 * Syncs project pom.xml properties with what is in core
 * @param {string} branch - branch to be checked against (eg: main)
 * @returns {Promise<void>} fulfilled promise
 */
async function updatePom(branch) {
    const corePomProperties = await getCorePomProperties(branch);

    await Promise.all(
        POM_PROPERTIES_TO_CHECK.map(async function(property) {
            const coreValue = getPomProperty(property, corePomProperties);

            printHeader(`Syncing ${property} ...`);
            return await exec(
                `mvn versions:update-property -Dproperty=${property} -DnewVersion=[${coreValue}] -DallowDowngrade=true -DgenerateBackupPoms=false`
            );
        })
    );
}

usage('Usage: $0 [options]')
    .command(
        ['sync'],
        'Sync pom.xml properties with what is in core',
        () => {},
        argv => {
            updatePom(argv.branch)
                .then(() => {
                    printSuccess('Successfully synced pom.xml');
                    process.exit(0);
                })
                .catch(e => {
                    printError(`Failed to sync pom.xml : ${e.message}`);
                    process.exit(1);
                });
        }
    )
    .command(
        ['check'],
        `Check if pom.xml properties are in sync with what is in core`,
        () => {},
        argv => {
            checkProjectPomProperties(argv.branch);
        }
    )
    .alias('b', 'branch')
    .nargs('b', 1)
    .describe('b', 'branch ("main", "226/patch" ...)')
    .demandOption(['b'])
    .help('h')
    .alias('h', 'help').argv;
