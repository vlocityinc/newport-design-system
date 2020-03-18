## The Work

[@W-xxxxxxxx](https://gus.lightning.force.com/lightning/r/ADM_Work__c/item_number/view)

(Include a @P4CL:XXX@ annotation in the PR title to bundle a shelved p4 CL, where XXX is the CL number)

## Description

Description of your changelist. Provide links to any design docs + UX specs or make sure they are in your GUS story/bug.

## Merge Checklist

-   [ ] Added / updated tests (if applicable)
-   [ ] Registered new namespaces (if applicable)
-   [ ] Included all associated work items as "@W-" entries in the PR title and / or description

## Release Actions

###### DISCLAMER: This should only be checked in the case of an emergency push otherwise core is automatically set to scan for changes every 4 hours

-   [ ] Update Core

###### This should be checked in most cases - when you want to update the work item to 'Fixed' after this PR is merged

-   [ ] Set associated work items as "Fixed"
