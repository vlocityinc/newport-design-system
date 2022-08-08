# CLCO

## Update nucleus.yaml
- Wait for #nucelus-talk notification for branch creation.
- Checkout newly created `core-240-patch` branch.
- Update `nucleus.yaml` to reflect the correct jar auto-increment start value.
```
core-240-patch:
        pull-request:
            <<: *branch-definition # inherit
        version:
            <<: *version-definition
            initial-value: <value of the last shipped out jar on master>
        core-deploy:
            annotations:
                - nomerge # so these changes don't propogate across major branches.
```
---
## Update master pom.xml
- Checkout `ui-interaction-builder-components`'s master branch
- Update `pom.xml`'s version to reflect the latest core version.
```
<version>242-SNAPSHOT</version>
```