({
    init: function (cmp) {
        var bodyComponent = cmp.get('v.bodyComponent');
        if (bodyComponent){
            var loggingUtils = cmp.find('loggingUtils');
            loggingUtils.logPerfTransactionStart(bodyComponent.desc);
            $A.createComponent(bodyComponent.desc, bodyComponent.attr, function(newCmp, status, errorMessage){
                if (status === 'SUCCESS') {
                    var body = cmp.find('body-content');
                    body && body.set('v.body', newCmp); // setting the newly created assignment editor here in body
                    loggingUtils.logPerfTransactionEnd(bodyComponent.desc, {context: {
                        action: "Load",
                        target: "builder_platform_interaction:propertyEditor",
                        gusTeamId: "a00B00000019ubOIAQ",
                        message: "Property editor body created successfully"
                    }});
                } else if (status === 'ERROR') { 
                    loggingUtils.logPerfTransactionEnd(bodyComponent.desc, {context: {
                        action: "Load",
                        target: "builder_platform_interaction:propertyEditor",
                        gusTeamId: "a00B00000019ubOIAQ",
                        message: "Error creating the property editor body"
                    }});
                    throw new Error('Error creating the property editor: ' + errorMessage);
                }              
            });
        }
    },

    handleAddNewResource: function(cmp) {
        var newResourceCallback = cmp.get('v.newResourceCallback');
        if (newResourceCallback && typeof newResourceCallback === 'function') {
            newResourceCallback();
        }
    },
    
    closePanel: function(cmp) {
        var closeActionCallback = cmp.get('v.closeActionCallback');
        var panelInstance = cmp.get('v.panelInstance');
        cmp.getEvent('notify').setParams({
            action: 'closePanel',
            typeOf: 'ui:closePanel',
            callback: closeActionCallback(panelInstance)
        }).fire();
    },
    
    setHeaderTitle: function(cmp, title) {
    	var panelInstance = cmp.get('v.panelInstance');
    	if (!panelInstance) {
    		return;
    	}
    	var headerComponent = panelInstance.get('v.header')[0];
        headerComponent.set('v.titleForModal', title);
    }
})