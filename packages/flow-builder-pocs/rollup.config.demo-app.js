/* eslint-disable */

const path = require('path');
const lwcCompiler = require('@lwc/rollup-plugin');
const syntheticShadow = require('./synthetic-shadow');
const replace = require('rollup-plugin-replace');
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';

const plugins = [];

// resolve modules using jest.config.json
// copied from https://git.soma.salesforce.com/aura/lightning-global/blob/master/ui-lightning-components/app_modules/resolver/module-name-mapper.js
const moduleNameMapper = {
    'builder_platform_interaction/drawingLib': './src/demo-app/stubs/drawingLib.js',
    '^lightning:IntlLibrary$': './src/demo-app/stubs/intlLibrary.js',
    '^(demo)-(.+)$': './src/demo-app/modules/$1/$2/$2.js',
    '^@label/(.+)$': './src/demo-app/labels/$1.js',
    '^(aura)$': './src/demo-app/stubs/$1.js',
    '^(instrumentation/service)$': './src/demo-app/stubs/metricsService.js',
    '^siteforce:quarterbackLibrary$': './src/demo-app/stubs/siteforceQuarterbackLibrary.js',
     '^@salesforce/label/(.+)$': './src/demo-app/labels/$1.js',
    '^(builder_platform_interaction)/(.+)$': './build//$1/$2/$2.js',
    '^(runtime_sales_templatebuilder)/(.+)$': './src/$1/$2/$2.js'
};

const compiledModuleNameMapper = Object.keys(moduleNameMapper).reduce((map, pattern) => {
    return map.set(new RegExp(pattern), path.resolve(moduleNameMapper[pattern]));
}, new Map());

plugins.push({
    name: 'rollup-resolver',
    resolveId(id) {
        for (const [regex, filepath] of compiledModuleNameMapper.entries()) {
            if (regex.test(id)) {
                return id.replace(regex, filepath);
            }
        }
        return undefined;
    }
});

plugins.push(
    lwcCompiler({
        mapNamespaceFromPath: true,
        resolveFromPackages: true
    })
);

plugins.push(
    replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
);

plugins.push(syntheticShadow());
plugins.push(resolve());
plugins.push(commonJS({ include: /node_modules/ }));

module.exports = [
    {
        input: path.resolve('src/demo-app/builder.js'),
        output: {
            file: path.resolve('build/demo-app/builder.js'),
            format: 'iife'
        },
        plugins
    }
];
