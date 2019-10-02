To update flowWithAllElements.json :

1) create a new flow named "flowWithAllElements" and save it (you can move the start element to have the save button enabled)
2) add a breakpoint in TranslatorLib.translateFlowToUIModel
3) refresh the page (F5)
4) in the console :
flow = [paste from the contents of flowWithAllElements.json]
5) the flow with all the elements is loaded
6) Change the flow
7) put a breakpoint in editor.js after
const flow = translatorLib.translateUIModelToFlow(storeInstance.getCurrentState());
8) save the flow
9) copy the output from JSON.stringify(flow.metadata, null, 2)
10) update metadata (only !) in flowWithAllElements.json 
10) the save will fail but that's expected (apex class, local action missing)
11) run the tests suite

To update autolaunchedFlow.json : same thing