# Labels

Any client facing strings should be put inside labels for localization.

For now our local labels are generated through Core by importing from `@salesforce/label`.

In order for the labels to appear when running the local app, you need to manually import labels from Core

Run the following script to put labels from a Core labels.xml into the local app.

```commandline
node scripts/labels/update-labels.js --labelFile ~/blt/app/main/core/shared-labels/java/resources/sfdc/i18n/shared_core_ui_labels/builderframework.xml
 *    --targetDir ../../packages/flow-builder-pocs/src/demo-app/labels/
```
