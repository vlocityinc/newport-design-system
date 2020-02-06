/**
 * Map npm packages to lwc namespace
 *
 * Ex:
 *  config :
 *      {  packageName : "@lbf", namespace : "builder" }
 *  input :
 *      import { Canvas } from '@lbf/canvas-impl';
 *  output :
 *      import { Canvas } from 'builder/canvasImpl';
 */

module.exports = config => {
    const nameMapper = config.nameMapper;

    return {
        visitor: {
            ImportDeclaration: path => {
                const source = path.node.source.value;
                if (nameMapper[source]) {
                    path.node.source.value = nameMapper[source];
                }
            }
        }
    };
};
