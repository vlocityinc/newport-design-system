({
    init: function (cmp) {
        var bodyComponent = cmp.get('v.bodyComponent');
        if (bodyComponent){
            $A.createComponent(bodyComponent.desc, bodyComponent.attr, function(newCmp, status, errorMessage){
                if (status === 'SUCCESS') {
                    var body = cmp.find('body-content');
                    body && body.set('v.body', newCmp); // setting the newly created assignment editor here in body
                } else if (status === 'ERROR') {
                    // TODO: handle it more elegantly using a generic user friendly error message popup instead of a stack trace.
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