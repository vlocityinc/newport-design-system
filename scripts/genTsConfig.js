const fs = require('fs');
const { resolve } = require('path');

const workspaces = require(resolve('.', 'package.json')).workspaces;

function genJsConfig(packageDir) {
    const npm2lwc = require(resolve(`./${packageDir}`, 'package.json')).npm2lwc;

    if (!npm2lwc || !npm2lwc.ui) {
        return;
    }

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

    "compilerOptions": {
        "declaration": false,
        "strict": true,
        "noUnusedLocals": false,
        "noImplicitAny": false,
        "outDir": "./build/builder_platform_interaction",
        "baseUrl": "./src",
         "paths": {
            "lightning/utils": ["../../../../node_modules/lwc-components-lightning/src/lightning/utils/utils.js"],
            "builder_platform_interaction/autoLayoutCanvas": ["../../auto-layout-canvas/dist/types/index.d.js"],
            ${paths}
         }
    },

    "include": ["src/**/*"]
}`
    );
}

workspaces.forEach(workspace => genJsConfig(workspace));
