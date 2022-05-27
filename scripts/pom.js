require('dotenv').config();
const xml2js = require('xml2js');
const { usage } = require('yargs');
const fs = require('fs');
const { log, printError, printSuccess, printHeader, printWarning } = require('./utils');
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

const POM_PROPERTIES_TO_CHECK = [
    ['aura.version'],
    ['lwc.version'],
    ['spring.version'],
    ['google.closure-compiler.version', 'com.google.javascript', 'closure-compiler']
];

const PROPERTIES_FIELDS = { name: 'Property name', projectVersion: 'Project version', coreVersion: 'Core version' };
const getCorePomXml = (branch) => {
    return p4.cmd(`print -q //app/${branch}/core/third_party/dependencies/com_salesforce.bzl`).then((p4Response) => {
        if (p4Response.error) {
            throw Error(p4Response.error[0].data);
        }
        return p4Response.data;
    });
};
const getPomXml = async (pomXml) => xml2js.parseStringPromise(pomXml, { explicitArray: false, ignoreAttrs: true });

const getProjectPomObject = async () => {
    const pomXml = fs.readFileSync('pom.xml', 'utf-8');
    return getPomXml(pomXml);
};

const buildDependenciesMap = (map, { groupId, artifactId, version }) => {
    map[toDependencyIdentifier(groupId, artifactId)] = version;
    return map;
};

const toDependencyIdentifier = (groupId, artifactId) => `${groupId}:${artifactId}`;
const dependenciesSort = (dep1, dep2) => (dep1.groupId + dep1.artifactId).localeCompare(dep2.groupId + dep2.artifactId);

const getProjectPomProperties = async () => {
    const {
        project: { properties }
    } = await getProjectPomObject();
    return properties;
};

const getPomProperty = (propertyName, pomProperties) => pomProperties[propertyName];

const getVersionsNotInSync = async (branch) => {
    const data = await getCorePomXml(branch);
    const corePomProperties = data
        .split('\n')
        .filter((line) => line.startsWith('_'))
        .map((line) => line.replace(/\"/g, '').split(' = '))
        .reduce((acc, curr) => {
            acc[curr[0]] = curr[1];
            return acc;
        }, {});

    const projectPomProperties = await getProjectPomProperties();
    return POM_PROPERTIES_TO_CHECK.map(([propertyName, groupId, artifactId]) => {
        const coreVersion = corePomProperties['_' + propertyName.toUpperCase().replace('.', '_')];

        if (coreVersion) {
            const projectVersion = getPomProperty(propertyName, projectPomProperties);

            if (!projectVersion) {
                printWarning(`Could not get version for "${propertyName}" property in project pom.xml`);
                return;
            }
            if (projectVersion !== coreVersion) {
                return {
                    [PROPERTIES_FIELDS.name]: propertyName,
                    [PROPERTIES_FIELDS.projectVersion]: projectVersion,
                    [PROPERTIES_FIELDS.coreVersion]: coreVersion
                };
            }
        } else {
            printWarning(`Could not get version for "${propertyName}" property in core pom.xml`);
        }
    }).filter(Boolean);
};

/**
 * Check if project pom.xml properties are in sync with what's in core
 * @param {string} branch - branch to be checked against (eg: main)
 * @returns {Promise<void>}
 */
const checkProjectPomProperties = async (branch) => {
    try {
        printHeader(`Checking pom properties (${branch} branch)`);

        const propertiesNotInSync = await getVersionsNotInSync(branch);

        const hasPropertiesNotInSync = propertiesNotInSync.length > 0;
        if (hasPropertiesNotInSync) {
            printError('The following property versions are out of sync with core:');
            console.table(propertiesNotInSync);
            printError('Run `yarn update:pom` to update.\n');
        } else {
            printSuccess('pom.xml in sync with core');
        }
        process.exit(hasPropertiesNotInSync ? 1 : 0);
    } catch (e) {
        printError(`Error while checking pom properties: ${e.message}`);
        process.exit(1);
    }
};

/**
 * Syncs project pom.xml properties with what is in core
 * @param {string} branch - branch to be checked against (eg: main)
 * @returns {Promise<boolean>} fulfilled Promise with returned value true if any updates applied
 * @throws error if no version found for given property
 */
const updateProjectPomProperties = async (branch) => {
    const propertiesNotInSync = await getVersionsNotInSync(branch);
    let projectPom = fs.readFileSync('pom.xml').toString();
    let hasSomePomUpdates = false;
    printHeader(`Syncing pom properties (${branch} branch)...`);
    propertiesNotInSync.forEach((property) => {
        const propertyName = property[PROPERTIES_FIELDS.name];
        const propertyCoreVersion = property[PROPERTIES_FIELDS.coreVersion];

        const pomPropertyRegex = RegExp(`<${propertyName}>(.+)</${propertyName}>`);
        const propertyMatch = pomPropertyRegex.exec(projectPom);
        if (!propertyMatch) {
            throw new Error(`Could not get version from pom.xml for "${propertyName}"`);
        }
        const projectVersion = propertyMatch[1];
        if (projectVersion !== propertyCoreVersion) {
            log(
                chalk.green(
                    'Updated',
                    chalk.bold(`${propertyName}`),
                    'from',
                    chalk.bold(`${projectVersion}`),
                    'to',
                    chalk.green.bold(`${propertyCoreVersion}`)
                )
            );
            projectPom = projectPom.replace(
                pomPropertyRegex,
                `<${propertyName}>${propertyCoreVersion}</${propertyName}>`
            );
            hasSomePomUpdates = true;
        }
        if (hasSomePomUpdates) {
            fs.writeFileSync('pom.xml', Buffer.from(projectPom));
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
            updateProjectPomProperties(argv.branch)
                .then((hasSomeUpdates) => {
                    printSuccess(
                        `${
                            hasSomeUpdates ? '\nSuccessfully updated' : 'No updates needed, all properties in sync in'
                        } pom.xml`
                    );
                })
                .catch((e) => {
                    printError(`Failed to sync pom.xml: ${e.message}`);
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
