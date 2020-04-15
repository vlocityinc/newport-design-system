# Flow Builder App and Components

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

Flow Builder is a project that provides an builder app to create flows, and a set of reusable lwc components.

## Getting started

Instructions to setup your environment to develop and run the Flow Builder app in core can be found [here](/docs/DevelopmentSetup.md)

Take a look at the [Setup FAQ](https://salesforce.quip.com/BFVUA1AxQWKb) if you run into any issues or the [#move-builder-to-git](https://platformcloud.slack.com/archives/CQH866GSZ) slack channel.

## Overview of the structure of the repo

The repo defines multiple npm packages in the `packages` folder. The package `flow-builder/ui` is the npm package for the `ui-interaction-builder-components`. This is where you will find all the code that has been migrated from P4.

It is build and managed using `yarn`.
