Jest integration test rules
===========================
1) Never ever mock anything else than a call to FlowBuilderController
That can be done using (for ex) :
setAuraFetch(auraFetch(getAllAuraActions(FLOW_PROCESS_TYPE.FLOW)));

Exceptions :
- labels
- uses of Aura

2) Do not forge your mock data
Instead, use gold files created using FlowBuilderControllerGoldFileTest
The gold files are in ui-interaction-builder-components/test/func/results/FlowBuilderControllerGoldFileTest

To use them, import the json file using :
    import { rules } from 'serverData/RetrieveAllRules/rules.json';
    
If necessary, you can create more gold files in FlowBuilderControllerGoldFileTest

3) Use a flow from jest-mock-data/mock_flows
It is generally better to use flowWithAllElements.json or autolaunchedFlow.json
You can add more elements to these flows : follow instructions at jest-mock-data/mock_flows/readme.txt