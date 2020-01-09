# Local Setup

Our repo is currently a monorepo setup using [lerna](https://github.com/lerna/lerna).
The project consist of many sub packages than can be built individually, but we recommend running all commands from the project root to avoid any issues.

# Prerequisites

The following software packages are required to successfully develop using the ui-interaction-builder-components repository:

-   [Node.js](https://nodejs.org/en/) (LTS 10.16.3)
-   [yarn](https://yarnpkg.com/lang/en/docs/install/) (1.17.3)
-   Git (latest version)

## Yarn

We use `yarn` as our package manager, alternative to npm. This tool pulls in all the packages and dependencies we need to run our app.

Check if you have yarn with...

```bash
which yarn
```

If you don't have yarn, please reference [the Yarn site](https://yarnpkg.com/lang/en/docs/install/) for your OS specific download

### Setup Nexus NPM

Setup nexus/npm as described here:
https://confluence.internal.salesforce.com/pages/viewpage.action?spaceKey=NEXUS&title=Nexus+NPM+Repositories

### Clone the repo

```commandline
$ git clone git@git.soma.salesforce.com:BuilderFramework/automation-platform/ui-interaction-builder-components.git
$ cd ui-interaction-builder-components
```

### Install

Now you'll need to pull in the dependencies for our application. Use the following command:

```commandline
yarn install
```

### Build

```commandline
$ yarn build
```

Our build process is very tricky as we handle both NPM and Core deployments in the same repo for the time being.
More info on our build process can be found in this [doc](https://salesforce.quip.com/1NPgA1ObQxsY#PVdACAI8soZ).

### Start

```commandline
$ yarn start
```

Open `localhost:3000` in your browser and you will be taken to the sample builder

If you are running your builder through Core, see our [Core Setup](CoreSetup.md) documentation

### Development

For quicker build times while developing you can run `yarn build:dev` instead of `yarn build`

Right now you need to manually run file watchers if developing on Core
Run both of these processes in parallel to get live changes in your running Core app:

```commandline
$ run-p watch:core watch
```

### Labels

If you need to add or change any labels, please see our [documentation on labels](Labels.md)
