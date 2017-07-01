({
    doTriggerPropertyEditor : function(cmp, event, helper) {
        var context = event.getParam("context");
        var itemId = event.getParam("componentType");
        var properties = event.getParam("properties");
        var componentLabel = event.getParam('componentLabel');
        var isValid = event.getParam('isValid');

        cmp.set('v.changedProperties', new Object());
        cmp.set('v.context', context);

        helper.commons.component.createComponent(
                'markup://visualEditor:componentPropertiesEditor', {
                    connectorType : cmp.get('v.connectorType'),
                    validateAttributesOnInit : false,
                    itemId : itemId,
                    attributeValues : properties,
                    params : event.getParam("params"),
                    context : context
                }, function(propsEditor) {
                    propsEditor.getConcreteComponent()
                            .setAttributeValueProvider(cmp);

                    cmp.set('v.displayPropertyEditor', true); // Display
                    // property
                    // editor

                    cmp.set('v.body', [ propsEditor ]);
                });
    },

    doTriggerPropertyEditorAfterModelChange : function(cmp, event, helper) {
        var context = event.getParam("componentInstance").id;
        var itemId = event.getParam("type");
        var properties = event.getParam("componentInstance").properties;
        var isValid = event.getParam('isValid');

        cmp.set('v.changedProperties', new Object());
        cmp.set('v.context', context);

        helper.commons.component.createComponent(
                'markup://visualEditor:componentPropertiesEditor', {
                    connectorType : cmp.get('v.connectorType'),
                    validateAttributesOnInit : false,
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

    onOk : function(cmp, event, helper) {
        var propsChangedEvent = $A
                .getEvt("markup://flexipageEditor:propertiesChanged");
        propsChangedEvent.setParam("arePropsValid", true);
        propsChangedEvent.setParam("isValid", true);
        propsChangedEvent.setParam("context", cmp.get("v.context"));
        propsChangedEvent.setParam("props", cmp.get("v.changedProperties"));
        propsChangedEvent.fire();

        cmp.set('v.changedProperties', new Object());
    },

    fireComponentValidated : function(cmp, event, helper) {
        cmp.set("v.isValid", event.getParam("isValid"));
    },

    firePropertiesChanged : function(cmp, event, helper) {
        var changedProperties = cmp.get("v.changedProperties");
        for ( var i in event.getParams().props) {
            changedProperties[i] = event.getParams().props[i].value;
        }
        cmp.set("v.isValid", event.getParam("isValid"));
    }
});
