const { readdirSync } = require('fs');

const paths = readdirSync('packages/@flow-builder/ui/src/builder_platform_interaction', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(
        dirent =>
            `"builder_platform_interaction/${dirent.name}": ["./src/builder_platform_interaction/${dirent.name}/${dirent.name}.js"]`
    )
    .join(',\n');

console.log(`{
    "compilerOptions": {
        "experimentalDecorators": true,
        "baseUrl": ".",
        "target": "es6",
        "module": "commonJS",
        "paths": {
            ${paths}
        }
    }
}`);
