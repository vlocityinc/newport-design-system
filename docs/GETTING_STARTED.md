# Getting Started

1. Install prerequisites
    - [Node.js](https://nodejs.org/en/) (version 10.16.3)
    - [yarn](https://yarnpkg.com/lang/en/docs/install/) (version 1.19.1)
1. Setup nexus/npm as described here:
   https://confluence.internal.salesforce.com/pages/viewpage.action?spaceKey=NEXUS&title=Nexus+NPM+Repositories
1. Clone the repo

    ```commandline
    $ git@git.soma.salesforce.com:automation-platform/automation-platform/ui-interaction-builder-components.git
    $ cd ui-interaction-builder-components
    ```

1. Install dependencies

    ```commandline
    $ yarn install
    ```

1. Build

    ```commandline
    $ yarn build
    ```

1. Start

    ```commandline
    $ yarn start
    ```

Open `localhost:3000` in your browser and you will be taken to the sample builder.

Or create a new flow in core if you did a push to core
