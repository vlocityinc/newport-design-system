({
    handleUpdateNodeOnOk: function(cmp, activeModal) {
        var propertyEditor = activeModal.get('v.body')[0];
        if (propertyEditor && propertyEditor.isValid()) {
            var nodeUpdate = propertyEditor.get("v.nodeUpdate");
            var node = propertyEditor.get("v.body")[0].getNode();
            var validationErrors = propertyEditor.get("v.body")[0].validate();
            if (validationErrors) {
                if (node && nodeUpdate && validationErrors.length === 0) {
                    nodeUpdate(node);
                    this.closePanel(cmp);
                } else if (validationErrors.length > 0 ) {
                    // TODO: W-4988215 Set errors on footer status icon component
                }
            }
        } 
    },
    
    closePanel: function(cmp) {
        cmp.getEvent('notify').setParams({
            action: 'closePanel',
            typeOf: 'ui:closePanel'
        }).fire();
    }
})