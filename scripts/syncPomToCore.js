const exec = require('await-exec');
const chalk = require('chalk');
const { getPomProperty, getCorePomProperties, POM_PROPERTIES_TO_CHECK } = require('./utils');

/**
 * Syncs pom.xml's dependencies with what is in core
 *
 * Usage: node ./scripts/checkPom.js
 */

async function updatePom() {
    const corePomProperties = await getCorePomProperties();

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

updatePom()
    .then(() => {
        console.log(chalk.green('Successfully updated pom.xml'));
        process.exit(0);
    })
    .catch(e => {
        console.log(chalk.red(`Failed to update pom.xml : ${e.message}`));
        process.exit(1);
    });
