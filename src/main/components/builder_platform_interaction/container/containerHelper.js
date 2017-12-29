({
    /***************************************************************************
     * Get the flow from java controllers
     * 
     * @param cmp
     * @param flowId
     */
    getFlow : function(cmp, flowId) {
        var action = cmp.get("c.retrieveFlow");

        action.setParams({
            id : flowId
        });

        action.setCallback(this, function(result) {
            // TODO add a library method to generically handle success, error,
            // and other states
            if (result.getState() === this.constant.STATE.SUCCESS) {
                var flow = result.getReturnValue();
                cmp.set("v.flow", flow);
            }
        });

        $A.enqueueAction(action);
    },

    /**
     * Save the flow in the backend
     * 
     * @param cmp
     * @param flow
     */
    saveFlow : function(cmp, flow) {
        var action = cmp.get("c.saveFlow");

        action.setParams({
            builderFlow : flow
        });

        // TODO add a library method to generically handle success, error, and
        // other states
        action.setCallback(this, function(result) {
            if (result.getState() === this.constant.STATE.SUCCESS) {
                // TODO
            }
        });

        $A.enqueueAction(action);
    }

    /************* Private Methods *****************/
    /************* Add private methods below this line *****************/
});
