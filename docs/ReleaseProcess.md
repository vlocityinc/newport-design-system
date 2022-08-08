# Release Process

This document explains the release process to push code to different branches in core.

## main

To target main, you do development on a git feature branch that is created off the `master` branch. If you need to do changes in p4, you create a CL for them and shelve the CL.

When ready, you push the feature branch to github and create a PR against the master branch. The PR will display a template where you can specify a p4 CL that should be bundled with your git changes.

When the PR is approved, you merge it into `master`. This will trigger a release build that will ultimitely generate a new artifact for `ui-interaction-builder-components` that will be deployed to Nexus. The release build will also update the artifact reference in the p4 `main` branch and commit the CL you specified if any.

Example:

```sh
git checkout master
git pull
git checkout -b ppominville/my-feature
git add .
git commit -m 'my feature'
git push
```

then go to github and create the PR.

![Sample PR](assets/pull request.png 'Sample PR')

## patch

Same process as for `main` except you create a feature branch off the git `core-240-patch` branch.

### Manual integration

Once the changes are merged into the `core-240-patch` branch, you will need to cherry-pick the commit into a new feature branch off `master` and create a PR for it.

Example:

```sh
git checkout core-240-patch
git pull
git checkout -b ppominville/240/my-feature
git add .
git commit -m 'my 240 feature'
git push
```

then go to github and create a PR against 224. Once merged, cherry-pick the commit:

```sh
git checkout master
git pull
git checkout -b ppominville/main/my-feature
git cherry-pick <core-240-patch-branch-commit-hash>
git push -u origin ppominville/main/my-feature
```

then go to github and create a PR against master.

## freeze

Steps to make the change are very similar to steps needed in `patch`.

With a following differences...
- Changes need to be made to `core-240-freeze`.
- Manual integration need to be done into both `core-240-patch` and `master`.
