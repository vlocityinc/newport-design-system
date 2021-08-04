# Flow Builder App and Components

<p>
  <a href="https://github.com/lerna/lerna">
    <img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg">
  </a>

  <a href="https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V14.md#14.15.4">
    <img src="https://img.shields.io/badge/node-%3E%3D14.15.4%20%3C15.0.0-blue">
  </a>

  <a href="https://github.com/yarnpkg/yarn">
    <img src="https://img.shields.io/badge/yarn-%3E%3D1.3.2-yellow">
  </a>

  <a href="https://github.com/microsoft/TypeScript">
    <img src="https://img.shields.io/badge/typescript-~4.1.3-green">
  </a>
</p>

Flow Builder is a project that provides a builder app to create flows, and a set of reusable lwc components.

## Getting started

Instructions to set up your environment to develop and run the Flow Builder app in core can be found [here](/docs/DevelopmentSetup.md)

Take a look at the [Setup FAQ](https://salesforce.quip.com/BFVUA1AxQWKb) if you run into any issues or the [#move-builder-to-git](https://salesforce-internal.slack.com/archives/C024ZHFT8J0) Slack channel.

## Overview of the structure of the repo

This repository defines multiple NPM packages in the `packages` folder. The package `flow-builder/ui` is the NPM package for the `ui-interaction-builder-components`. This is where you will find all the code that has been migrated from P4.

It is built and managed using `yarn`.

## Running/debugging the tests

You can run all the tests by doing `yarn test:unit`

To update all the snapshots:
`yarn test:update-snapshots`

If you want to run a single test file you should `cd` to the packages folder where the test is located and use `yarn jest` eg

`cd packages/@flow-builder/ui`
`yarn jest src/builder_platform_interaction/editor/__tests__/editor.test.ts`

then to debug a test file (via Node.js V8 inspector Manager: [NiM](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj) - through a web browser session and dev tools breakpoints) :

`cd packages/@flow-builder/ui`
`node --inspect-brk ../../../node_modules/.bin/jest src/builder_platform_interaction/editor/__tests__/editor.test.ts`


NB: for UI packages (ie: [@flow-builder/ui](/packages/@flow-builder/ui) and [@flow-builder/auto-layout-canvas-ui](/packages/@flow-builder/auto-layout-canvas-ui)) a [VSCode](https://code.visualstudio.com/) [debug configuration file](/.vscode/launch.json) has been added to the repository.
You can directly use this to debug inside VSCode adding some breakpoints directly in your IDE and benefit from [VSCode debug features](https://code.visualstudio.com/docs/editor/debugging).
To debug your test file, open it, add your breakpoint, open the debug view from the activity bar and simply run the configuration in place ("Debug current Jest test file (ui packages)" by default).

Example:

![VScode_debug.png](assets/VScode_debug.png)

A couple of [VSCode Jest extensions](https://marketplace.visualstudio.com/search?term=jest&target=VSCode&category=All%20categories&sortBy=Relevance) can make your life even easier, providing ways to debug a single test for instance (see [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) among others).

## SFCI Setup and CLCO

https://salesforce.quip.com/1EaPA6rRXRCK

## Troubleshooting FAQ

https://salesforce.quip.com/z8xpAys68qkw

## Support on Slack

For any CI build related issues, please post to our Slack [automation-builder-ci-support](https://salesforce-internal.slack.com/archives/C024CJQ4C9M) channel after reading the Troubleshooting FAQ.

For general Git questions, please post to our Slack [move-builder-to-git](https://salesforce-internal.slack.com/archives/C024ZHFT8J0) channel.
