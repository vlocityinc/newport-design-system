# Core Setup

If you plan on deploying your Builder code in Core,
you have two options:

1.  Set up your local development environment to use the nexus imported jar (preferred if you are consuming builder framework in a relatively static fashion - no ongoing work in builder framework)

1.  Set up your local development environment to use a local Builder Framework git repo (preferred if you are actively making changes to builder framework in parallel to the core project work)

## Using nexus imported jar

This should "just work". Simply import the needed package. E.g.:

```
import {
   editor
} from 'builder_platform_interaction/editor';
```

## Using a local Repo into Core

The objective here is to tell Core where to load your local source code instead of using the JAR found in Nexus:

1.  Open `~/blt/app/main/core/workspace-user.xml` to edit

1.  Add a `<moduleImport>` entry under the `<moduleImports>` node, updating the value of the entry to be the absolute path to the location of your cloned repository. `<moduleImports>` is under `<workspace>` node.
    ```xml
    <moduleImports>
        <moduleImport>/the/location/of/this/git/repository/on/your/local/machine/ui-interaction-builder-components</moduleImport>
    </moduleImports>
    ```
1.  Add the following properties to the `<properties>` node if they are not already present.
    `<properties>` node is under `<workspace>` node.
    ```xml
      <properties>
        <repository.system.validation>DISABLED</repository.system.validation>
        <modularity.enforcer.disabled>true</modularity.enforcer.disabled> <skipJsDoc>true</skipJsDoc>
      </properties>
    ```
1.  Add a `<ui-interaction-builder-components.version>` entry under the `<properties>` node from Step 3.
    Update the `224-SNAPSHOT` value to match the version listed at the top of this modules's [POM file](/pom.xml).
    It will be between the `<version> ... </version>` tags.
    This tells Core to use the version in our local repository rather than download a JAR.
    ```xml
    <properties>
        <repository.system.validation>DISABLED</repository.system.validation>
        <modularity.enforcer.disabled>true</modularity.enforcer.disabled>
        <skipJsDoc>true</skipJsDoc>
        <ui-interaction-builder-components.version>226-SNAPSHOT</ui-interaction-builder-components.version>
    </properties>
    ```
    > **Important**: When you want to consume artifacts from Core comment out all of these changes.
        You don't want to think you are using the JAR in core when you are actually using your local
1.  The end result should be a `core/workspace-user.xml` file that looks a bit like this:

    ```xml
    <?xml version="1.0" ?>
    <workspace>
        <modules>
            ...
        </modules>
        <moduleImports>
            <moduleImport>/Users/username/path/to/repo/ui-interaction-builder-components</moduleImport>
        </moduleImports>
        <properties>
            <repository.system.validation>DISABLED</repository.system.validation>
            <modularity.enforcer.disabled>true</modularity.enforcer.disabled>
            <skipJsDoc>true</skipJsDoc>
            <ui-interaction-builder-components.version>226-SNAPSHOT</ui-interaction-builder-components.version>
        </properties>
    </workspace>
    ```

1.  If you haven't already. Install maven on your machine and configure it to run on core:
    ```commandline
    $ cd app/main/core/build
    $ ./ant create-maven-env
    $ ./maven-env.sh
    ```
1.  Run maven install in your local repo
    ```commandline
    $ cd /Users/path/to/repo/ui-interaction-builder-components/
    $ mvn install
    ```
1.  Run a build
    ```commandline
    $ yarn build
    ```
    For Eclipse users follow the [Eclipse documentation](Eclipse.md) for the necessary additional setup and troubleshooting
    Now you are set up to point to Builder Framework source code from Core,
    open http://localhost:6109/builder_platform_interaction/flowBuilder.app to see the sample builder

### **Important**: Branch Mismatch

When working with any branch other than the current release branch (e.g. 222), make sure the repositories point to the same release.

```sh
# In this repository, check out the proper branch:
git checkout 224
```

In the `workspace-user.xml` _for the 224 branch_, reference the correct release JAR:

```xml
<ui-interaction-builder-components.version>224-SNAPSHOT</ui-interaction-builder-components.version>
```

##
