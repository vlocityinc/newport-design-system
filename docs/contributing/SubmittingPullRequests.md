# Submitting Pull Requests

Before going into how to submit a pull request to the repo make sure you've already
read through our [git setup](Git.md)

Following the git setup you should be looking at a forked version of the repository.
As an example lets start on a typical development flow for a bug fix or feature:

1.  Checkout a new feature branch
    ```commandline
    $ git checkout -b <name>-myBugFix
    ```
1.  Make the bug fix changes - including tests
    ```commandline
    $ git add --all
    $ git commit -m "Description of bug fix"
    ```
    Double check to ensure your code is **tested** and there a written tests covering the fix
1.  Run all validation checks locally
    -   Lint: `yarn lint`
    -   Unit Tests: `yarn test:unit`
    -   Integration Test: `yarn test:integration`
    -   Prettier: `Run with your IDE for now (TBD on script to run)`
1.  Rebase to master
    ```commandline
    $ git rebase master
    ```
1.  Push your branch to your origin repo
    ```commandline
    $ git push origin <name>-myBugFix
    ```
1.  Open up a PR from your fork and submit it upstream. Follow this [article](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork) for help.
    -   If your PR is associated with a GUS work item, include it in the title like this:
        `@W-123456 My bug fix description`. This way you work item will link back to your commit in GUS
1.  Once your PR is up, post the link to our [Slack](/docs/CONTACT_US.md) at-mentioning the reviewers

    -   Validations will automatically be run on your PR to verify you passed the checks.
        If they don't pass you won't be able to merge until they do.

    -   To debug a validation failure follow the "Failed build #xx" link sent to your email and click on "Console Output" to find the stacktrace.

    -   If you're PR validations aren't done running after ~20 mins [contact us](/docs/CONTACT_US.md)

1.  Address any comments and push needed commits to your branch for them to update in the PR
    -   Do not use any history changing commands(git rebase, git commit -amend) once the PR is up.
        They can cause [problems](https://mirrors.edge.kernel.org/pub/software/scm/git/docs/user-manual.html#problems-With-rewriting-history) for other users.
1.  Finally after passing all checks you can use Squash and Merge to merge the PR into master.
    Your change will go out to NPM and Core when the master commit is tagged in a release. See tags [here](https://git.soma.salesforce.com/automation-platform/ui-interaction-builder-components/releases).

        To consume your new bug fix or feature PR, see our docs on our [release process](ReleaseProcess.md)
