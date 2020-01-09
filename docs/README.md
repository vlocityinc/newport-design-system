# Flow Builder App and Components

Flow Builder is a project that provides an builder app to create flows, and a set of reusable lwc components.

## Getting started

Instructions to setup your environment to develop and run the Flow Builder app in core can be found here [here](/docs/DevelopmentSetup.md)

## Overview of the structure of the repo

This is a mono repo leveraging the [lerna](https://github.com/lerna/lerna) to manage it. It is structured like other salesforce mono repos such as [BuilderFramework](https://git.soma.salesforce.com/BuilderFramework/builder-framework) and [webruntime](https://git.soma.salesforce.com/communities/webruntime) among many others.

The repo defines multiple npm packages in the `packages` folder. The package `flow-builder/ui` is the npm package for the `ui-interaction-builder-components`. This is where you will find all the code that has been migrated from P4.

It is build and managed using `yarn`.
