# Development Setup

## Local Git Repo

1. Install prerequisites

Node.js (version 10.16.3)
yarn (version 1.19.1)

Setup nexus/npm as described here: https://confluence.internal.salesforce.com/pages/viewpage.action?spaceKey=NEXUS&title=Nexus+NPM+Repositories

Note: If you haven't setup SSH Keys before you can look here: https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

2. Check that you have the right versions installed:

```sh
yarn --version && node --version
> 1.19.1
> v10.16.3
```

To update your node version do: `nvm install v10.16.3 && nvm use v10.16.3)`

To update your yarn version do: `brew unlink yarn && brew install yarn@1.19.1`

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

8.  Run mvn compile (See instructions here to setup mvn: https://sites.google.com/a/salesforce.com/butc/user-documentation/install-maven):

    ```sh
    mvn compile
    ```

    If you have any auth errors here, make sure the file `~/.m2/settings.xml` has your valid nexus tokens.
    If you don't have a `~/.m2/settings.xml` see this setting up maven doc: https://git.soma.salesforce.com/modularization-team/maven-settings/blob/master/QuickStart.md or this one here: https://git.soma.salesforce.com/modularization-team/maven-settings

9.  Run this watch command so that when you modify files, they are picked up by core:

```sh
 yarn watch:core
```

10. (Optional) Run the unit tests:

```sh
yarn test:unit
```

Once core is up and running, if you make changes in your git repo, they should be reflected in the your running core instance after a few seconds.

## Core Setup

Currently the Flow Builder app cannot be run as a standalone app and must be run in core.

When doing development you need to configure core and point it to where you cloned this repository so that it can pick up the `ui-interaction-builder-components` sources as you edit them, instead of using the JAR published in Nexus:

1.  Open `~/blt/app/main/core/workspace-user.xml` to edit

2.  Add a `<moduleImport>` entry under the `<moduleImports>` node, updating the value of the entry to be the absolute path to the location of your cloned repository. `<moduleImports>` is under `<workspace>` node.

        ```xml
        <moduleImports>
            <moduleImport>/Users/ppominville/projects/ui-interaction-builder-components</moduleImport>
        </moduleImports>
        ```

    and remove or comment out the `ui-interaction-builder-components` module:

```xml
<!--
<module>ui-interaction-builder-components</module>
<module>ui-interaction-builder-components/test/func</module>
<module>ui-interaction-builder-components/test/unit</module>
-->
```

3.  Add the following properties to the `<properties>` node if they are not already present.
    `<properties>` node is under `<workspace>` node.

    ```xml
      <properties>
        <repository.system.validation>DISABLED</repository.system.validation>
        <modularity.enforcer.disabled>true</modularity.enforcer.disabled>
        <skipJsDoc>true</skipJsDoc>
        <ui-interaction-builder-components.version>226-SNAPSHOT</ui-interaction-builder-components.version>
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
          <ui-interaction-builder-components.version>226-SNAPSHOT</ui-interaction-builder-components.version>
      </properties>
  </workspace>
```

4.  Clean, Sync, Build

Before going further, make sure to stash or save any uncommitted changes you have done in core. Then clean and sync:

```sh
blt --clean-all
blt --sync force
```

Make sure you don't have any files under `ui-interaction-builder-components`, if you do delete them:

```sh
rm -rf core/ui-interaction-builder-components
```

Then build:

```sh
blt --build
```

### **Important**: Branch Mismatch

When working with any branch other than the current release branch (e.g. 224), make sure the repositories point to the same release.

```sh
# In this repository, check out the proper branch:
git checkout 224
```

In the `workspace-user.xml`, update the `ui-interaction-builder-components` version:

```xml
<ui-interaction-builder-components.version>224-SNAPSHOT</ui-interaction-builder-components.version>
```
