const exec = require('await-exec');
const chalk = require('chalk');
const xml2js = require('xml2js');
const P4 = require('p4api').P4;
const p4 = new P4();
const { usage } = require('yargs');
const fs = require('fs');

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
        console.log(chalk.red(`Warning: ${property} is out of sync with core: ${coreValue} vs ${projectValue}`));
        return false;
    }
    return true;
}

/**
 * Check if pom.xml's dependencies are in sync with whats in core
 *
 */
async function checkProjectPomProperties(branch) {
    try {
        const projectPomProperties = await getProjectPomProperties();
        const corePomProperties = await getCorePomProperties(branch);

        const hasErrors = !POM_PROPERTIES_TO_CHECK.every(property =>
            checkProperty(property, projectPomProperties, corePomProperties)
        );

        if (hasErrors) {
            console.log(chalk.red('\nRun `yarn update:syncPomToCore` to update.'));
        } else {
            console.log(chalk.green('pom.xml in sync with core'));
        }
        process.exit(hasErrors ? 1 : 0);
    } catch (e) {
        console.log(chalk.red(`Error while checking pom properties : ${e.message}`));
        process.exit(1);
    }
}

/**
 * Syncs pom.xml's dependencies with what is in core
 *
 */
async function updatePom(branch) {
    const corePomProperties = await getCorePomProperties(branch);

    await Promise.all(
        POM_PROPERTIES_TO_CHECK.map(async function(property) {
            const coreValue = getPomProperty(property, corePomProperties);

            console.log(`Updating ${property} ...`);
            return await exec(
                `mvn versions:update-property -Dproperty=${property} -DnewVersion=[${coreValue}] -DallowDowngrade=true -DgenerateBackupPoms=false`,
                (error, stdout, stderr) => {
                    const errorMessage = (error && error.message) || stderr;
                    if (errorMessage) {
                        throw Error(errorMessage);
                    }
                }
            );
        })
    );
}

usage('Usage: $0 [options]')
    .command(
        ['sync'],
        'Sync pom.xml dependencies with what is in core',
        () => {},
        argv => {
            updatePom(argv.branch)
                .then(() => {
                    console.log(chalk.green('Successfully updated pom.xml'));
                    process.exit(0);
                })
                .catch(e => {
                    console.log(chalk.red(`Failed to update pom.xml : ${e.message}`));
                    process.exit(1);
                });
        }
    )
    .command(
        ['check'],
        `Check if pom.xml's dependencies are in sync with what is in core`,
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
