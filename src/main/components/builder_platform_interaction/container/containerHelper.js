({
    /***************************************************************************
     * Get the flow from java controllers
     *
     * @param {Object} cmp component definition
     * @param {String} flowId id of a flow
     */
    getFlow: function(cmp, flowId) {
        var action, uiModel, storeInstance;
        action = cmp.get("c.retrieveFlow");

        action.setParams({
            id: flowId
        });

        action.setCallback(this, function(result) {
            // TODO add a library method to generically handle success, error,
            // and other states
            if (result.getState() === this.constant.STATE.SUCCESS) {
                uiModel = this.translatorLib.translateFlowToUIModel(
                    result.getReturnValue()
                );

                storeInstance = cmp.get("v.storeInstance");
                storeInstance.dispatch(this.actions.updateFlow(uiModel));
            }
        });

        $A.enqueueAction(action);
    },

    /**
     * Save the flow in the backend
     *
     * @param {Object} cmp component definition
     * @param {Object} uiModel flow UI object to be saved
     */
    saveFlow: function(cmp, uiModel) {
        var action = cmp.get("c.saveFlow");
        
        var flow = this.translatorLib.translateUIModelToFlow(uiModel);

        action.setParams({
            flow: flow
        });

        // TODO add a library method to generically handle success, error, and
        // other states
        action.setCallback(this, function(result) {
            if (result.getState() === this.constant.STATE.SUCCESS) {
                // TODO
            }
        });

        $A.enqueueAction(action);
    },

    /**
     * Initialize store to be used by entire app
     * @param {Object} cmp component definition
     */
    initStore: function(cmp) {
        var storeInstance;
        storeInstance = this.storeLib.Store.getStore(this.reducers.reducer);
        cmp.set("v.storeInstance", storeInstance);
    }

    /************* Private Methods *****************/
    /************* Add private methods below this line *****************/
});
