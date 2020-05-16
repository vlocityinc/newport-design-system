const fs = require('fs');

const packageDir = 'packages/@flow-builder/ui';
const lwcModuleDir = `${packageDir}/src/builder_platform_interaction`;

const paths = fs
    .readdirSync(lwcModuleDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(
        dirent =>
            `            "builder_platform_interaction/${dirent.name}": ["./builder_platform_interaction/${dirent.name}/${dirent.name}.ts"]`
    )
    .join(',\n');

fs.writeFileSync(
    `${packageDir}/tsconfig.json`,
    `{
    "extends": "../../../tsconfig.json",

    "compilerOptions": {
        "declaration": false,
        "strict": false,
        "noUnusedLocals": false,
        "noImplicitAny": false,
        "outDir": "./build/builder_platform_interaction",
        "baseUrl": "./src",
         "paths": {
            "lwc": ["../../../../node_modules/@lwc/engine/dist/modules/es2017/engine.js"],
            "lightning/utils": ["../../../../node_modules/lwc-components-lightning/src/lightning/utils/utils.js"],
            "builder_platform_interaction/flowUtils": ["../../flow-utils/build/esNext/types/index.d.ts"],
            ${paths}
         }
    },

    "include": ["src/**/*"]
}`
);
