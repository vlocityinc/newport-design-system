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
            if (result.getState() === 'SUCCESS') {
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
            if (result.getState() === 'SUCCESS') {
                // TODO
            }
        });

        $A.enqueueAction(action);
    },
    
    /***************************************************************************
     * Get the flow operator rules from java controllers
     *
     * @param {Object} cmp component definition
     */
    initRules : function(cmp) {
        var action, rules;
        action = cmp.get("c.retrieveAllRules");
        // The rules are read-only so we can cache them
        action.setStorable();

        action.setCallback(this, function(result) {
            // TODO add a library method to generically handle success, error,
            // and other states
            if (result.getState() === 'SUCCESS') {
                rules = result.getReturnValue();
                this.ruleLib.setRules(rules);
            }
        });

        $A.enqueueAction(action);
    },

    initActionFunctions : function(cmp) {
        this.actioncallLib.setGetAllInvocableActionsForTypeFunction(this.getEnqueueActionFunction(cmp,
                "c.getAllInvocableActionsForType", true, []));
        this.actioncallLib.setGetApexPluginsFunction(this.getEnqueueActionFunction(cmp, "c.getApexPlugins", true, []));
        this.actioncallLib.setGetInvocableActionParametersFunction(this.getEnqueueActionFunction(cmp,
                "c.getInvocableActionParameters", true, [ "actionName", "actionType" ]));
    },

    /**
     * Return a function that adds a server-side controller action to the queue of actions to be executed
     * 
     * @param {String}
     *            actionName name of the action
     * @param {boolean] 
     *            storable true to mark the server-side action as storable
     * @param {String[]}
     *            paramNames name of the parameters
     */
    getEnqueueActionFunction : function(cmp, actionName, storable, paramNames) {
        var that = this;
        return $A.getCallback(function call() {
            var action, returnValue, params, functionCallback, i;
            action = cmp.get(actionName);
            if (storable === true) {
                action.setStorable();
            }
            params = {};
            for (i = 0; i < paramNames.length && i < arguments.length - 1; i++) {
                params[paramNames[i]] = arguments[i];
            }
            functionCallback = arguments[arguments.length - 1];
            action.setParams(params);
            action.setCallback(that, $A.getCallback(function(response) {
                var state = response.getState();
                if (state === 'SUCCESS') {
                    returnValue = response.getReturnValue();
                    functionCallback(returnValue);
                } else if (state === 'INCOMPLETE') {
                    // TODO : add handlers for force:showOfflineMessage and force:showMessage
                    $A.getEvt('markup://force:showOfflineMessage').setParams({
                        retryAction : response
                    }).fire();
                } else if (state === 'ERROR') {
                    $A.getEvt('markup://force:showMessage').setParams({
                        message : response.getError()[0].message,
                        severity : "error"
                    }).fire();
                }                
            }));
            $A.enqueueAction(action);        
        });
    },
    
    /**
     * Initialize store to be used by entire app
     * @param {Object} cmp component definition
     */
    initStore: function(cmp) {
        var storeInstance;
        storeInstance = this.storeLib.Store.getStore(this.reducers.reducer);
        cmp.set("v.storeInstance", storeInstance);
    },
    
    /**
     * Retrieves a list of canvas elements that can be created for the flow.
     * @param {Object} cmp component definition 
     */
    // TODO: Add support for flow types, different types may have different elements.
    initElementsPalette: function(cmp) {
        var action = cmp.get("c.retrieveElementsPalette");
        
        // The elements shown in the palette seldom change so we can cache the results.
        action.setStorable();
        
        action.setCallback(this, function(result) {
            // TODO: add a library method to generically handle success, error, and other states
            if (result.getState() === 'SUCCESS') {
                var elements = result.getReturnValue();
                this.paletteLib.ElementsPalette.getInstance().setElements(elements);
            }
        });
        
        $A.enqueueAction(action);
    }

    /************* Private Methods *****************/
    /************* Add private methods below this line *****************/
});
