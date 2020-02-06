import { banner } from './utils';
import { resolve } from 'path';

export default {
    input: resolve(process.cwd(), 'build/esNext/index.js'),
    output: {
        file: resolve(process.cwd(), 'dist/index.esNext.js'),
        format: 'esm',
        banner
    },
    external: ['instrumentation/service']
};
