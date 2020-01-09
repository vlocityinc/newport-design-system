# Consuming Builder Framework

Our code is shipped to two different places: to NPM as javascript modules, and to Core as a UI-Tier module.

If you are consuming Builder Framework you need to decide on how you will be consuming as the two processes for importing
are different.

## NPM

NPM consumption is fairly straight forward, if you're already familiar with NPM its the same process as any other package.

For those new to NPM:

1. Add the package name you want to consume to your `package.json` dependencies specifying the version you want
    - Example `package.json`:
        ```json
        "dependencies": {
            "@lbf/editor": "0.0.51",
            "@lbf/data-service": "0.0.51",
            "@lbf/utils": "0.0.51"
        },
        ```
1. Run `yarn install`
1. Import the module and use
    - Example: `import { DataService } from '@lbf/data-service'`

We currently do not ship any LWC components to NPM from the `ui` package, more info will be added when we do.
All other packages under the `@lbf` scope are shipped to NPM.

## Core

When consuming Builder Framework as a core module, you will be consuming a JAR imported from Nexus or through local mavenImports

Each NPM typescript module is compiled to javascript then transpiled and deployed to core as a single LWC library.

Due to different rules of NPM javascript vs LWC libraries, there is a small extra transpilation step done to the NPM packages to prepare them for Core.

If you are looking to use a Builder Framework package from within core the best way is to run a `yarn build`
and look under `/src/` to see what components and modules you can import into your Core module.

More information on this process can be found [here](https://salesforce.quip.com/1NPgA1ObQxsY)
