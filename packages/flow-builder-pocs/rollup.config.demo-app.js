const path = require('path');
const fs = require('fs');
const lwcCompiler = require('@lwc/rollup-plugin');
const syntheticShadow = require('./synthetic-shadow');
import commonJS from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

const plugins = [];

// resolve modules using jest.config.json
// copied from https://git.soma.salesforce.com/aura/lightning-global/blob/master/ui-lightning-components/app_modules/resolver/module-name-mapper.js
const moduleNameMapper = {
    '^lightning:IntlLibrary$': './src/demo-app/stubs/intlLibrary.js',
    '^builder_framework/command$': '../../node_modules/@lbf/command/dist/index.esNext.js',
    '^(demo)-(.+)$': './src/demo-app/modules/$1/$2/$2.js',
    '^@label/(.+)$': './src/demo-app/labels/$1.js',
    '^(aura)$': './src/demo-app/stubs/$1.js',
    '^(o11y/client)$': './src/demo-app/stubs/o11y.js',
    'analyzer_framework/api': '../../ui/jest-modules/analyzer_framework/api/api.ts',
    '^(instrumentation/service)$': './src/demo-app/stubs/metricsService.js',
    '^siteforce:quarterbackLibrary$': './src/demo-app/stubs/siteforceQuarterbackLibrary.js',
    '^@salesforce/label/(.+)$': './src/demo-app/labels/$1.js',
    '^@salesforce/loader$': './src/demo-app/stubs/loader.js',
    '^(builder_platform_interaction)/(.+)$': '../../src/main/modules/$1/$2/$2.js',
    '^(contentbuilder)/(.+)$': './src/$1/$2/$2.js',
    '^lightning/(.+)$': '../../node_modules/lwc-components-lightning/src/lightning/$1/$1.js',
    '^@salesforce/i18n/(.+)/(.+)$':
        '../../node_modules/lwc-components-lightning/scopedImports/@salesforce-i18n-$1.$2.js',
    '^@salesforce/(.+)/(.+)$': '../../node_modules/lwc-components-lightning/scopedImports/@salesforce-$1-$2.js'
};

const compiledModuleNameMapper = Object.keys(moduleNameMapper).reduce((map, pattern) => {
    return map.set(new RegExp(pattern), path.resolve(moduleNameMapper[pattern]));
}, new Map());

plugins.push({
    name: 'rollup-resolver',
    resolveId(id) {
        for (const [regex, filepath] of compiledModuleNameMapper.entries()) {
            if (regex.test(id)) {
                let resolved = id.replace(regex, filepath);
                if (!fs.existsSync(resolved)) {
                    resolved = './src/demo-app/missingLabel.js';
                }
                return resolved;
            }
        }
        return undefined;
    }
});

plugins.push(
    lwcCompiler({
        mapNamespaceFromPath: true,
        resolveFromPackages: true,
        stylesheetConfig: { customProperties: { allowDefinition: true } },
        experimentalDynamicComponent: {
            loader: '@salesforce/loader',
            strictSpecifier: false
        }
    })
);

plugins.push(
    replace({
        // eslint-disable-next-line lwc-core/no-process-env
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true
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
