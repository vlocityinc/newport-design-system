({
    initActionFunctions : function(cmp) {
        this.actioncallLib.setGetAllInvocableActionsForTypeFunction(this.getEnqueueActionFunction(cmp,
                "c.getAllInvocableActionsForType", true, []));
        this.actioncallLib.setGetApexPluginsFunction(this.getEnqueueActionFunction(cmp, "c.getApexPlugins", true, []));
        this.actioncallLib.setGetInvocableActionParametersFunction(this.getEnqueueActionFunction(cmp,
                "c.getInvocableActionParameters", true, [ "actionName", "actionType" ]));
        this.actioncallLib.setGetSubflowsFunction(this.getEnqueueActionFunction(cmp, "c.getSubflows", true, []));
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
