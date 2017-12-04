({
    onInit: function(cmp, event, helper) {
        var flowId = cmp.get('v.flowId');
        if (!$A.util.isUndefinedOrNull(flowId)) {
            helper.getFlow(cmp, flowId);
        } else {
            // Add code for creating a new flow
        }
    },

    handleSaveFlow: function(cmp, event, helper) {
        var flow = event.getParams();
        helper.saveFlow(cmp, flow);
    }
});
