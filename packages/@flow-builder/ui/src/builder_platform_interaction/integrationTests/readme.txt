Jest integration test rules
===========================
1) Never ever mock anything else than calls to FlowBuilderController.
Default call out stubs are activated with the call to initializeAuraFetch().
See initializeAuraFetch() implementation if you need to override the default stubs.

Exceptions :
- labels
- uses of Aura
- drawingLib
- keyboardInteractionUtils

2) Do not forge your mock data
Instead, use gold files created using FlowBuilderControllerGoldFileTest
The gold files are in packages/@flow-builder/ui/jest-mock-data/results/FlowBuilderControllerGoldFileTest and are copied from core
(ui-interaction-builder-components/test/func/results/FlowBuilderControllerGoldFileTest) using yarn:updateGoldFiles

To use them, import the json file using :
    import { rules } from 'serverData/RetrieveAllRules/rules.json';
    
If necessary, you can create more gold files in FlowBuilderControllerGoldFileTest and update them in the git repo using yarn:updateGoldFiles

3) Use a flow from jest-mock-data/mock_flows
It is generally better to use flowWithAllElements.json or autolaunchedFlow.json
You can add more elements to these flows : follow instructions at jest-mock-data/mock_flows/readme.txt

Note :
A good integration test sample is assignmentEditorIntegration.test.js