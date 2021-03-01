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

Take a look at the [Setup FAQ](https://salesforce.quip.com/BFVUA1AxQWKb) if you run into any issues or the [#move-builder-to-git](https://platformcloud.slack.com/archives/CQH866GSZ) slack channel.

## Overview of the structure of the repo

This repository defines multiple NPM packages in the `packages` folder. The package `flow-builder/ui` is the NPM package for the `ui-interaction-builder-components`. This is where you will find all the code that has been migrated from P4.

It is built and managed using `yarn`.

## Running the tests

You can run all the tests by doing `yarn test:unit`

If you want to run/debug a single test you should cd to the packages where the test is located and use `yarn lwc-test` eg

`cd packages/@flow-builder/ui`
`yarn lwc-test src/builder_platform_interaction/editor/__tests__/editor.test.ts`

To debug a test:
`yarn lwc-test --debug src/builder_platform_interaction/editor/__tests__/editor.test.ts`

To update all the snapshots in a package:
`yarn test:unit --updateSnapshot`

## SFCI Setup and CLCO

To add a new branch under SFCI you need to do the following:

-   Edit the `git-perforce-branch-mapping.yaml` and `sfci.yaml`
-   In the repo's github Settings, make the new branch protected
-   Run a SFCI seed job like here https://sfcirelease.dop.sfdc.net/job/SFCI%20MIGRATION%20JOBS/job/SFCI%20seed%20job/

```text
git_organization_name: automation-platform
git_repository_name: ui-interaction-builder-components
git_branches: 226 226-freeze 228 228-freeze 230
existing_Jenkins_URL: https://automation-builderci.dop.sfdc.net
jenkinsfile_path: Jenkinsfile
```

-   Reach out to the SFCI team (`#sfci-support` on slack) and ask them to point the managed pipeline file to that seed job. (This is needed because we are using a managed pipeline, and we don't have a Jenkins file)

## Troubleshooting FAQ

https://salesforce.quip.com/z8xpAys68qkw

## Support on Slack

For any CI build related issues, please post to our slack [automation-builder-ci-support](https://platformcloud.slack.com/archives/C018MEDNTRU) channel after reading the Troubleshooting FAQ.

For general git questions, please post to our [move-builder-to-git](https://platformcloud.slack.com/archives/CQH866GSZ) channel.
