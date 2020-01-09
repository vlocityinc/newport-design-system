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
git cherry-pick <commit-hash>
git commit -m 'cherry picked 224/my-feature'
git push
```

And then go to github and create a PR against master.

## freeze

For freeze changes you will need to create a feature branch cut off the latest patch release tag. You then need to modify the `git-perforce-branch-mapping.yaml` and `sfci.yaml` files to include it. For example:

sfci.yaml:

```yaml
release_branches: ['master', '224', '224-my-freeze-fix']
```

git-perforce-branch-mapping.yaml:

```yaml
'224-my-freeze-fix': '//app/224/freeze/...'
```

You then follow the same process as for `main` and `patch`. In particular you will need to cherry-pick your commit into `224` and `master`.

## prod

For prod you follow the freeze workflow. Then in p4 you need to integrate your p4 CL that is in freeze to the prod branch and submit it manually.
