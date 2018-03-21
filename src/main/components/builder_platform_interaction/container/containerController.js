({
    onInit: function(cmp, event, helper) {
        var flowId;
        helper.initStore(cmp);
        
        // TODO: Combine these into a single call to reduce the number of server round trips.
        flowId = cmp.get('v.flowId');
        if (!$A.util.isUndefinedOrNull(flowId)) {
            helper.getFlow(cmp, flowId);
        } else {
            // Add code for creating a new flow
        }
        helper.initRules(cmp);
        helper.initElementsPalette(cmp);
        helper.initActionFunctions(cmp);
    },

    handleSaveFlow: function(cmp, event, helper) {
        var flow = cmp.get('v.storeInstance').getCurrentState();
        helper.saveFlow(cmp, flow);
    }
});
