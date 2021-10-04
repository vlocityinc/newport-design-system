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
    <img src="https://img.shields.io/badge/typescript-~4.3.5-green">
  </a>
</p>

Flow Builder is a project that provides a builder app to create flows, and a set of reusable lwc components.

## Getting started

Instructions to set up your environment to develop and run the Flow Builder app in core can be found [here](/docs/DevelopmentSetup.md)

Take a look at the [Troubleshooting FAQ](https://salesforce.quip.com/z8xpAys68qkw) if you run into any issues or the [#move-builder-to-git](https://salesforce-internal.slack.com/archives/C024ZHFT8J0) Slack channel.

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

NB: You can run/debug test(s) right in your IDE (eg: VSCode), [here](RunningDebugJestInIDE.md) for details.

## SFCI Setup and CLCO

https://salesforce.quip.com/1EaPA6rRXRCK

## Troubleshooting FAQ

https://salesforce.quip.com/z8xpAys68qkw

## Support on Slack

For any CI build related issues, please post to our Slack [automation-builder-ci-support](https://salesforce-internal.slack.com/archives/C024CJQ4C9M) channel after reading the Troubleshooting FAQ.

For general Git questions, please post to our Slack [move-builder-to-git](https://salesforce-internal.slack.com/archives/C024ZHFT8J0) channel.
