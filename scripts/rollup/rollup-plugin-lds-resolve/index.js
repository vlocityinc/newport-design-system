const path = require('path');
const fs = require('fs');

/*
 * Trys to resolve in the following order:
 *      * Append ".js"
 *      * Append "index.js" to path
 */
module.exports = function() {
    return {
        name: 'lds-resolve',
        resolveId(importee, importer) {
            // Disregard entry module
            if (!importer) {
                return null;
            }

            // Disregard absolute modules.
            if (importee.indexOf('./') === -1) {
                return null;
            }

            const basename = path.basename(importer);
            const directory = importer.split(basename)[0];
            const paths = [path.join(directory + importee) + '.js', path.join(directory + importee, 'index.js')];

            return firstInSequence(paths, fileExistsAsync).catch(() => {
                return null;
            });
        }
    };
};

function firstInSequence(values, asyncFn) {
    return new Promise((resolve, reject) => {
        // Are there any values to check?
        if (values.length === 0) {
            // All were rejected
            reject();
            return;
        }
        // Try the first value
        asyncFn(values[0])
            .then(val => {
                // Resolved, we're all done
                resolve(val);
            })
            .catch(() => {
                // Rejected, remove the first item from the array and recursively
                // try the next one
                values.shift();
                firstInSequence(values, asyncFn)
                    .then(resolve)
                    .catch(reject);
            });
    });
}

function statAsync(targetPath) {
    return new Promise((res, rej) => {
        fs.stat(targetPath, (err, stats) => {
            if (err) {
                rej(err);
                return;
            }

            res(stats);
        });
    });
}

function fileExistsAsync(targetPath) {
    return statAsync(targetPath).then(stats => {
        if (stats.isFile()) {
            return targetPath;
        }

        const err = null;
        throw err;
    });
}

// Synchronous version.
// const path = require('path');
// const fs  = require("fs");

// /*
//  * Trys to resolve in the following order:
//  *      * Append ".js"
//  *      * Append "index.js" to path
//  */
// module.exports =  function () {
//     return {
//         name: "lds-resolve",
//         resolveId(importee, importer) {
//             if (importee.indexOf('./') === -1) {
//                 return null;
//             }

//             // Disregard entry module
//             if (!importer) {
//                 return null;
//             }

//             const basename = path.basename(importer);
//             const directory = importer.split(basename)[0];
//             const jsFile = path.join(directory + importee) + ".js";
//             const dirIndexFile = path.join(directory + importee, "index.js");

//             let stats;

//             // Try ".js"
//             try {
//                 stats = fs.statSync(jsFile);
//             } catch (e) {

//             }

//             if (stats && stats.isFile()) {
//                 return jsFile;
//             }

//             // Try "index.js"
//             try {
//                 stats = fs.statSync(dirIndexFile);
//             } catch (e) {
//                 return null;
//             }

//             if (stats.isFile()) {
//                 return dirIndexFile;
//             }

//             return null;
//         }
//     };
// }
