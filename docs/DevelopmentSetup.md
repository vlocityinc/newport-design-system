# Development Setup

## Local Git Repo

1. Install prerequisites

- Node.js (version 14.17.0)
- yarn (version >=1.3.2)
- git (version >= 2.13.0 : this is necessary for [husky](https://github.com/typicode/husky/tree/master))

Setup nexus/npm as described here: https://confluence.internal.salesforce.com/pages/viewpage.action?spaceKey=NEXUS&title=Nexus+NPM+Repositories

Note: If you haven't setup SSH Keys before you can look here: https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

2. Check that you have the right versions installed:

```sh
yarn --version && node --version && git --version
```

To update your node version and use it by default, do:
```sh
nvm install 14.17.0 && nvm alias default 14.17.0
```

To update your yarn version do (1.22.4 here):
```sh
brew unlink yarn && brew install yarn@1.22.4
```
If it fails you may try:
```sh
curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.22.4
```

> Note: as long as **yarn** and **node** versions meet the corresponding engines versions constraints of the [project package.json file](https://git.soma.salesforce.com/automation-platform/ui-interaction-builder-components/blob/8c09fbd3bbecfd24c064a0fa6f9b20f1d0faaea3/package.json#L125) you're good to go.

3. Clone this repo somewhere on your filesystem (using `~projects` in this doc as an example):

```sh
cd ~/projects
git clone git@git.soma.salesforce.com:automation-platform/ui-interaction-builder-components.git
```

4. cd to the root of the cloned git repo:

```sh
 cd ~/projects/ui-interaction-builder-components
```

5.  Switch to the `master` branch if you are not already on it:

    ```sh
    git checkout master
    ```

6.  Install the npm modules for the repo:

    `yarn install`

    (if you have issues with this command run `rm yarn.lock` or run `git clean -xfd` and make sure you have no file changed with `git status`)

7.  Build the repo:

    ```sh
    yarn build
    ```

8.  Run mvn compile:

    ```sh
    mvn compile
    ```

    If you have any auth errors here, make sure the file `~/.m2/settings.xml` has your valid nexus tokens.
    If you don't have a `~/.m2/settings.xml` or need help with maven setup in general, see this maven doc: https://git.soma.salesforce.com/modularization-team/maven-settings/blob/master/QuickStart.md or this one here: https://git.soma.salesforce.com/modularization-team/maven-settings

9.  Run this watch command so that when you modify files, they are picked up by core (for best results picking up changes, run the app in an incognito browser):

```sh
 yarn watch:core
```

Once core is up and running, if you make changes in your git repo, they should be reflected in your running core instance after a few seconds.

10. (Optional) Run the unit tests:

```sh
yarn test:unit
```

11. (Optional) Configure your local git repository

Starting git v2.23, `git blame` supports an option to automatically ignore some revisions that are not meaningful. Those PR are listed in the `.git-blame-ignore-revs` file. If you don't want to specify this file each time you use [`git blame`](https://git-scm.com/docs/git-blame/), you can configure your repository:

```sh
git config blame.ignoreRevsFile .git-blame-ignore-revs
```


## Core Setup

Currently, the Flow Builder app cannot be run as a standalone app and must be run in core.

When doing development you need to configure core and point it to where you cloned this repository so that it can pick up the `ui-interaction-builder-components` sources as you edit them, instead of using the JAR published in Nexus:

1.  Open `~/blt/app/main/core/workspace-user.xml` to edit

2.  Add a `<moduleImport>` entry under the `<moduleImports>` node, updating the value of the entry to be the absolute path to the location of your cloned repository. `<moduleImports>` is under `<workspace>` node.

        ```xml
        <moduleImports>
            <moduleImport>/Users/ppominville/projects/ui-interaction-builder-components</moduleImport>
        </moduleImports>
        ```

    remove or comment out the `ui-interaction-builder-components` module:

```xml
<!--
<module>ui-interaction-builder-components</module>
<module>ui-interaction-builder-components/test/func</module>
<module>ui-interaction-builder-components/test/unit</module>
-->
```

3.  Add the following properties to the `<properties>` node if they are not already present, substituting your actual branch number, e.g., 234, for <CURRENT_RELEASE_NUMBER>.
    `<properties>` node is under `<workspace>` node.

    ```xml
      <properties>
        <repository.system.validation>DISABLED</repository.system.validation>
        <modularity.enforcer.disabled>true</modularity.enforcer.disabled>
        <skipJsDoc>true</skipJsDoc>
        <ui-interaction-builder-components.version><CURRENT_RELEASE_NUMBER>-SNAPSHOT</ui-interaction-builder-components.version>
      </properties>
    ```

    The end result should be a `core/workspace-user.xml` file that looks a bit like this:

```xml
  <?xml version="1.0" ?>
  <workspace>
     <username>Ld5pROLS</username>
     <password>********</password>
     <source>
      <branch>main</branch>
      <revision>20240879</revision>
      </source>
      <modules>
          ...
      </modules>
      <moduleImports>
          <moduleImport>/Users/ppominville/projects/ui-interaction-builder-components</moduleImport>
      </moduleImports>
      <properties>
          <repository.system.validation>DISABLED</repository.system.validation>
          <modularity.enforcer.disabled>true</modularity.enforcer.disabled>
          <skipJsDoc>true</skipJsDoc>
          <ui-interaction-builder-components.version>234-SNAPSHOT</ui-interaction-builder-components.version>
      </properties>
  </workspace>
```

4.  Sync, Build, Start the app
```sh
corecli core:sync ide:ide -b
```
Once your IDE has compiled coreapp, finish the build with (automatically launched in IntelliJ via [Core Dev Booster plugin](https://git.soma.salesforce.com/intellij/Core-Dev-Booster) if installed)
```sh
corecli core:build post plsql
```
Start the app with
```sh
corecli core:start
```

### **Important**: Branch Mismatch

When working with any branch other than the current release branch (e.g. 224), make sure the repositories point to the same release.

```sh
# In this repository, check out the proper branch:
git checkout 224
```

In the `workspace-user.xml`, update `_UI_INTERACTION_BUILDER_COMPONENTS_VERSION`:

```xml
<_UI_INTERACTION_BUILDER_COMPONENTS_VERSION>224-SNAPSHOT</_UI_INTERACTION_BUILDER_COMPONENTS_VERSION>
```
## STMFA/B environments

We can quickly check what is the latest version of `ui-interaction-builder-components` jar on STMFA and STMFB environments.
To do so, use the following commands:

For STMFA:
`yarn run check:stm-version`

For STMFB:
`yarn run check:stm-version stmfb`

## Perforce

Some NPM scripts (eg: [check:pom](https://git.soma.salesforce.com/automation-platform/ui-interaction-builder-components/blob/master/package.json#L17 'check:pom NPM script')) imply running some Perforce commands behind the hood.
As for any Perforce commands it requires some environment variables to be set.

### P4PORT

A [fallback](https://git.soma.salesforce.com/automation-platform/ui-interaction-builder-components/blob/master/scripts/pom.js#L8) pointing to the generic Perforce proxy (ie: ssl:p4proxy.soma.salesforce.com:1999) is in place.
Of course, you are free to force a custom one via a new CUSTOM_P4PORT entry in your project .env file for instance as follows:

`CUSTOM_P4PORT=ssl:p4proxy.paris.soma.salesforce.com:1999`

or still source `~/blt/env.sh`

**P4PORT** checks order is:

1. preexisting current environment variable in place
2. CUSTOM_P4PORT in project .env file
3. generic fallback

### P4CLIENT

Required for a script like [check:goldFiles](https://git.soma.salesforce.com/automation-platform/ui-interaction-builder-components/blob/master/package.json#L16 'check:goldFiles NPM script') for instance.
No generic fallback provided for sure but same thing as for P4PORT, you can add the CUSTOM_P4CLIENT entry inside your .env file as follows:

`CUSTOM_P4CLIENT=yourP4Client`

**P4CLIENT** checks order is:

1. preexisting current environment variable in place
2. CUSTOM_P4CLIENT in project .env file

