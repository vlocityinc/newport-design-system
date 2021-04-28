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
-   [ ] Auto Integrate (please read the notes below)

### Notes on auto integration

- If you want to integrate all of this PR's commits, you need to add `@ai-include all@` at the start of the PR title.
- If you want to exclude specific commits (like `pom.xml` commits, which are usually not to be integrated), or only include certain commits, refer to [this doc](https://confluence.internal.salesforce.com/display/public/ZEN/Auto+Integration+Workflow+with+Cherry-Picking)
- Checking 'Auto Integrate' is a no-op if this PR targets `master`.

NB: include a @P4CL:XXX@ annotation in your branch merge commit message to bundle a shelved p4 CL, where XXX is the CL number.
