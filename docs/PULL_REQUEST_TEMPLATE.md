## The Work

[@W-xxxxxxxx](https://gus.my.salesforce.com/apex/ADM_WorkLocator?bugorworknumber=W-xxxxxxxx)

## Description

Description of your changelist. Provide links to any design docs + UX specs or make sure they are in your GUS story/bug.

## Merge Checklist

-   [ ] Added / updated tests (if applicable)
-   [ ] Registered new namespaces (if applicable)
-   [ ] Included all associated work items as "@W-" entries in the PR title **AND** description

## Release Actions

-   [x] Update Core (requires associated work items as "@W-" entries in the PR title)
-   [ ] Set associated work items as "Fixed"
-   [ ] Auto Integrate (By default, it will try to merge the whole branch. If you only want to integrate this PR's commits, add `@ai-include all@` to the PR title, or follow [this doc](https://confluence.internal.salesforce.com/display/public/ZEN/Auto+Integration+Workflow+with+Cherry-Picking) for more options.)

NB: include a @P4CL:XXX@ annotation in your branch merge commit message to bundle a shelved p4 CL, where XXX is the CL number.
