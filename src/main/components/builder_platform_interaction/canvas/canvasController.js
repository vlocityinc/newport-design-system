({
    onModelLoaded : function(cmp, event, helper) {
        var model = event.getParam("model");
        var numOfElement = model.children.length;
        var i = 0;

        for (i = 0; i < numOfElement; i++) {
            var element = model.children[i];
            var targetItems = cmp.get("v.list1");

            targetItems.splice(targetItems.length, 0, element);
            cmp.set("v.list1", targetItems);
        }
    },

    onItemClick : function(component, event, helper) {
        $A.getEvt("markup://flexipageEditor:selectNode").setParams({
            id : event.source.get("v.data")["id"]
        }).fire();
    },

    onPropertiesChanged : function(cmp, event, helper) {
        var id = event.getParam('componentInstance').id;

        var targetItems = target.get("v.list1");

        for (i = 0; i < targetItems.length; i++) {
            var element = targetItems[i];
            if (element.id === id) {
                element.label = event.getParam('componentInstance').properties.label;
            }
        }

        target.set("v.list1", targetItems);
    },
});
