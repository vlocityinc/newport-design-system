# Development Setup

This document explains the release process to push code to different branches in core.

## main

To target main, you do development on a git feature branch that is created off the `master` branch. If the you need to do changes in p4, you create a CL for them and shelve the CL.

When ready, you push the feature branch to github and create a PR against the master branch. The PR will display a template where you can specify a p4 CL that should be bundled with your git changes.

When the PR is approved, you merge it into `master`. This will trigger a release build that will ultimitely generate a new artifact for `ui-interaction-builder-components` that will be deployed to nexux. The release build will also update the artifact reference in the p4 `main` branch and commit the CL you specified if any.

Example:

```sh
git checkout master
git pull
git checkout -b ppominville/my-feature
git add .
git commit -m 'my feature'
git push
```

And then go to github and create the PR.

![Sample PR](assets/pr.png 'Sample PR')

## patch

Same process as for `main` except you create a feature branch off the git `224` branch.

Once the changes are merged into the `224` branch, you will need to cherry-pick the commit into a new feature branch off `master` and create a PR for it.

Example:

```sh
git checkout 224
git pull
git checkout -b ppominville/224/my-feature
git add .
git commit -m 'my 224 feature'
git push
```

And then go to github and create a PR against 224. Once merged, cherry pick the commit:

```sh
git checkout master
git pull
git checkout -b ppominville/master/my-feature
git cherry-pick <commit-hash>
git push -u origin ppominville/main/my-feature
```

And then go to github and create a PR against master.

## freeze

For freeze changes you will need to :

-   get version for ui-interaction-builder-components.version in freeze/core/pom.xml
-   create 226-freeze branch cut off this release tag

```sh
git checkout -b 226-freeze sfci-{version}
```

-   modify the `git-perforce-branch-mapping.yaml`, `sfci.yaml` and `package.json` files to reference this branch :

sfci.yaml:

```yaml
release_branches: ['master', '226', '226-freeze']
```

git-perforce-branch-mapping.yaml:

```yaml
'226-freeze': '//app/226/freeze/...'
```

package.json:

```json
    "config": {
        "branch": "226/freeze"
    }
```

-   Follow the instructions [here](/docs/README.md#SFCI-Setup) to add the branch under SFCI.
-   A branch protection rule need to be created for 226-freeze (settings/branches). Use the same settings than for master. This must be done by a repository admin.
-   create a PR with your changes. Do not select "Update Core" : this is safer to create a P4 CL instead. Have it approved
-   merge your PR and wait a few minutes until a jar is released
-   Wait a few minutes until a jar is released and get the version number for the latest released jar for this branch in https://sfcirelease.dop.sfdc.net/job/automation-platform/job/automation-platform-ui-interaction-builder-components-Jenkinsfile/job/ui-interaction-builder-components/
-   Create a P4 CL that updates ui-interaction-builder-components.version with this version in freeze/core/pom.xml.
-   checkin your P4 CL once you get approval.
-   cherry-pick your commit into the patch branch (`226`) before next patch is promoted and to `master` if necessary.
-   delete branch protection rule for 226-freeze and then delete 226-freeze branch

## prod

For prod you follow the freeze workflow but with '226-prod'.

If you missed the cutoff for patch, you will also need to release a jar for 226/freeze.
You will need to resolve a blocked autointegration from prod to freeze. Use the released version for 226/freeze to resolve the merge issue for ui-interaction-builder-components.version in freeze/core/pom.xml. (You will need approval for that)
