({
    doTriggerPropertyEditor : function(cmp, event, helper) {
        var context = event.getParam("context");
        var itemId = event.getParam("componentType");
        var properties = event.getParam("properties");
        var componentLabel = event.getParam('componentLabel');
        var isValid = event.getParam('isValid');

        helper.commons.component.createComponent(
                'markup://visualEditor:componentPropertiesEditor', {
                    connectorType : cmp.get('v.connectorType'),
                    validateAttributesOnInit : true,
                    itemId : itemId,
                    attributeValues : properties,
                    params : event.getParam("params"),
                    context : context
                }, function(propsEditor) {
                    propsEditor.autoDestroy(false);
                    propsEditor.getConcreteComponent()
                            .setAttributeValueProvider(cmp);

                    cmp.set('v.displayPropertyEditor', true); // Display
                                                                // property
                                                                // editor

                    var body = cmp.get("v.body");
                    if (body && body.length > 0) {
                        // destroy the old editor once it is done validating all
                        // attributes
                        body[0].destroyWhenDone();
                    }
                    cmp.set('v.body', [ propsEditor ]);
                });
    },

    handleSaveInitiated : function(cmp, event, helper) {
        cmp.set("v._pendingSave", true);

        if (!helper.triggerPropertyEditorValidation(cmp, true)) {
            // if currently no visible property editor, just do the save
            helper.doPendingSave(cmp);
        }
    },

    fireComponentValidated : function(cmp, event, helper) {
        helper.doPendingSave(cmp);
    },

    firePropertiesChanged : function(cmp, event, helper) {
        $A.getEvt("markup://flexipageEditor:propertiesChanged").setParams(
                event.getParams()).fire();
    }
});
