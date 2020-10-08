import { banner, external } from './utils';
import { resolve } from 'path';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginCommonJS from '@rollup/plugin-commonjs';

const plugins = [];

plugins.push(pluginNodeResolve());
plugins.push(pluginCommonJS({ include: /node_modules/ }));

export default {
    input: resolve(process.cwd(), 'build/esNext/index.js'),
    output: {
        file: resolve(process.cwd(), 'dist/index.esNext.js'),
        format: 'esm',
        banner
    },
    external,
    plugins
};
