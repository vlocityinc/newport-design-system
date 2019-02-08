({  
    handleUpdateNodeOnOk: function(cmp) {
        cmp.set('v.isSaveDisabled', true);
        var panelInstance = cmp.get('v.panelInstance');
        var propertyEditor = panelInstance.get('v.body')[0];
        if (propertyEditor && propertyEditor.isValid()) {
            var propertyEditorInnerCmp = propertyEditor.find('body-content').get('v.body')[0];
            var validationErrors = propertyEditorInnerCmp.validate();
            if (validationErrors) {
                if (validationErrors.length === 0) {
                    var nodeUpdate = propertyEditor.get("v.nodeUpdate");
                    var node = propertyEditorInnerCmp.getNode();
                    if (node && nodeUpdate) {
                        nodeUpdate(node);
                        this.closePanel(cmp);
                    }
                } else if (validationErrors.length > 0 ) {
                    var errors = [];
                    for (var i = 0, len = validationErrors.length; i < len; i++) {
                        errors.push(
                            // TODO : talk about key(devName) to actual label in error messages, will be finalized as part of this work item W-5825889
                            validationErrors[i].key + ": " + validationErrors[i].errorString
                        );
                    }
                    cmp.set('v.isSaveDisabled', false);
                    cmp.set('v.messages', {'No Section': errors});
                    var statusIconCmp = cmp.find('statusIcon');
                    statusIconCmp.createPanel();
                }
            }
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
    }
})