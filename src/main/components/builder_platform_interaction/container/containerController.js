({
    onInit: function(cmp, event, helper) {
        var flowId;
        helper.initStore(cmp);
        flowId = cmp.get('v.flowId');
        if (!$A.util.isUndefinedOrNull(flowId)) {
            helper.getFlow(cmp, flowId);
        } else {
            // Add code for creating a new flow
        }
        helper.initRules(cmp);
    },

    handleSaveFlow: function(cmp, event, helper) {
        var flow = cmp.get('v.storeInstance').getCurrentState();
        helper.saveFlow(cmp, flow);
    }
});
