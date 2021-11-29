To update flowWithAllElements.json, autoLaunchedFlowScheduled.json, orchestratorFlow.json, recordTriggeredFlow.json, recommendationFlow.json, 
contactRequest.json (to be opened in the Setup from "Customer Contact Requests" using Lightning) :

1) create a scratch org using https://git.soma.salesforce.com/automation-platform/test-environments/tree/master/flowbuilder-eng
2) open flowWithAllElements
3) Change the flow
4) Save the flow
5) add a breakpoint in TranslatorLib.translateFlowToUIModel
6) refresh the page (F5)
7) in the console, type "flow.metadata", right-click on the result and choose "Copy Object"
10) update metadata (only !) in flowWithAllElements.json 
11) update https://git.soma.salesforce.com/automation-platform/test-environments/tree/master/flowbuilder-eng with the new flow and anything needed by the newly added elements (e.g. apex classes)
12) run the tests suite

To update fieldServiceMobileFlow.json :
(for fieldServiceMobileFlow, enable FieldService org perm and org pref)

1) create a new flow named "fieldServiceMobileFlow" and save it (you can move the start element to have the save button enabled)
2) add a breakpoint in TranslatorLib.translateFlowToUIModel
3) refresh the page (F5)
4) in the console :
flow = [paste from the contents of fieldServiceMobileFlow.json]
5) the flow with all the elements is loaded
6) Change the flow
7) put a breakpoint in editor.js in saveFlow after
const flow = translatorLib.translateUIModelToFlow(storeInstance.getCurrentState());
8) save the flow
9) in the console, type "flow.metadata", right-click on the result and choose "Copy Object"
10) update metadata (only !) in fieldServiceMobileFlow.json 
10) the save will fail but that's expected (apex class, local action missing)
11) run the tests suite
