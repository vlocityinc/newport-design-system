This folder contains mock data used by jest unit tests and integration tests.

# Flows
Flows are defined in [flows](flows) folder. These flows are all in "metadata format" (as returned by [retrieveFlow]( https://codesearch.data.sfdc.net/source/xref/app_main_core/app/main/core/ui-interaction-builder-impl/java/src/ui/interaction/builder/components/controllers/FlowBuilderController.java#retrieveFlow))

If the change you want to make is not specific to a specific flow type, modify [flowWithAllElements.json](flows/flowWithAllElements.json) by following [these steps](flows/readme.txt).

If the change is specific to a specific flow type, change corresponding flow in [flows](flows) (`autoLaunchedFlowScheduled.json`, `contactRequestFlow.json`, `fieldServiceMobileFlow.json`, `recordTriggeredFlow.json`, `scheduleTriggeredFlow.json`) by following the same steps.

**Never edit flows manually, always get flow json from server side call**

Most tests (except integration tests) need flow or flow elements in UI model format. You will need to run [flowTranslator.test.ts](../src/builder_platform_interaction/translatorLib/__tests__/flowTranslator.test.ts) tests to update corresponding UI model file.

Because jest unit tests generally need a single flow element and not the whole flow, update the storeData*.ts file ([storeData/storeData.ts](storeData/storeData.ts) for flowWithAllElements screen flow, [storeDataScheduleTriggered/storeDataScheduleTriggered.ts](storeDataScheduleTriggered/storeDataScheduleTriggered.ts) for schedule triggered flow ...) :
```javascript
export const subflowAutomaticOutput = getElementByName('subflowAutomaticOutput');
```

You can then use the UI model element in your jest unit test :
```javascript
import { subflowAutomaticOutput } from 'mock/storeData';
```

# Server side call results

You should avoid adding mock data for server side call results. 
If you do, you will have to update it each time server side data changes which is difficult to track and cumbersome.

**Instead you should as much as possible use goldfiles instead of manually forged mocks.**

For that :
1) add or modify tests in [FlowBuilderControllerGoldFileTest](https://codesearch.data.sfdc.net/source/xref/app_main_core/app/main/core/ui-interaction-builder-impl/test/func/java/src/ui/interaction/builder/components/controllers/FlowBuilderControllerGoldFileTest.java)

There is one test per `@AuraEnabled` method in `FlowBuilderController`

Name of each test is `test[FlowBuilderController @AuraEnabled method name]Serialization`

If the `@AuraEnabled` method has parameter, you can create several gold files with different parameters. Use assertCanRunAll so that the test updates all gold files instead of failing at first gold file difference.

```java
public void testGetAllGlobalVariablesSerialization() throws Exception {
  createCustomSettingWithTextField("CustomSetting", "CustomField");
  assertCanRunAll(
    () -> assertNoDiffWithGoldFile("globalVariablesForFlow", () -> sortAllGlobalVariables(controller.getAllGlobalVariables(FlowProcessType.Flow))),
    () -> assertNoDiffWithGoldFile("globalVariablesForAutoLaunchedFlow", () -> sortAllGlobalVariables(
             controller.getAllGlobalVariables(FlowProcessType.AutoLaunchedFlow))));
}
```

*Note : Currently, there is no gold file for flow extension details (see [W-8208977](https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000008guYXIAY/view))*

2) submit `FlowBuilderControllerGoldFileTest` and gold files to precheckin and wait until the gold files are checked in Perforce.

3) update the gold files in the git repository using
```sh
yarn update:goldFiles
```

Add the new/modified gold files to your git staging area.

Note that we check that gold files are in sync with core on each git push (when possible)

4) you can then use the mock data in your unit/integration jest tests :
```javascript
import { globalVariablesForFlow } from 'serverData/GetAllGlobalVariables/globalVariablesForFlow.json';
import { goldFileName } from 'serverData/NameOfAuraEnabledMethod/goldFileName.json';
```
Now you are guaranteed to use actual server data and not manually forged or outdated data!
