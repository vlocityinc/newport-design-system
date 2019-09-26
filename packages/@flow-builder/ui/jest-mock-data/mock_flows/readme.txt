To update flowWithAllElements.json :

You will need this apex class defined in your org :
    public class MyApexClass {
        @AuraEnabled
        public String name{get;set;}
    }

1) create a new flow named "flowWithAllElements" and save it (you can move the start element to have the save button enabled)
2) add a breakpoint in TranslatorLib.translateFlowToUIModel
3) refresh the page (F5)
4) in the console :
flow = [paste from the contents of flowWithAllElements.json]
5) the flow with all the elements is loaded
6) Change and save the flow
7) refresh (F5)
8) in the console
copy the output from JSON.stringify(flow, null, 2) to flowWithAllElements.json
9) run the tests suite

To update autolaunchedFlow.json :
Same thing except you don't need MyApexClass