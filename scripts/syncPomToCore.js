const exec = require('await-exec');
const chalk = require('chalk');
const { checkP4Env, getPomProperty, getCorePomProperties, POM_PROPERTIES_TO_CHECK } = require('./utils');

/**
 * Syncs pom.xml's dependencies with whats in core
 *
 * Usage: node ./scrits/checkPom.js
 */

let hasError = false;

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
                        hasError = true;
                        console.log(chalk.red(`Failed to updatet: ${error.message}`));
                        return;
                    }
                }
            );
        })
    );
}

checkP4Env();

updatePom().then(() => {
    if (hasError) {
        console.log(chalk.green('Successfully updated pom.xml'));
        process.exit(1);
    }
    process.exit(0);
});
