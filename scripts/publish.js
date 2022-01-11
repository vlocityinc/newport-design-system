const fs = require('fs-extra');
const { exec } = require('child_process');
const { resolve } = require('path');
const { findAllPackages } = require('./utils.js');

const startDir = process.cwd();
const packages = findAllPackages(resolve(startDir, './packages'));
const pushed = [];

const npmVersion = process.argv[2];

packages.forEach((pkg) => {
    let publishDir = pkg;
    const packageJson = fs.readJsonSync(resolve(pkg, 'package.json'));
    const name = packageJson.name;
    const isPrivate = packageJson.private;

    if (!isPrivate) {
        if (packageJson.publishConfig && packageJson.publishConfig.directory) {
            publishDir = resolve(pkg, packageJson.publishConfig.directory);
        }
        if (pushed.indexOf(name) === -1) {
            pushed.push(name);
            process.chdir(publishDir);
            exec(`npm version ${npmVersion} -y --no-git-tag-version && npm publish`, function (err, stdout, stdin) {
                if (err) {
                    console.error(err);
                }
                console.log(stdout);
                console.log(stdin);
            });
        }
    }
});
process.chdir(startDir);
