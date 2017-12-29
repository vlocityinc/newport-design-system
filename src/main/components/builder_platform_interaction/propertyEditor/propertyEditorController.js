({
    onInit: function(cmp) {
        var override = cmp.get("v.override");
        $A.createComponent(override.body.descriptor, override.body.attr, function(newCmp, status){
            if (status === "SUCCESS") {
                cmp.set("v.body", newCmp); // setting the newly created assignment editor here in body
            }               
        });
        
    },

    handleOk: function(cmp, event, helper) {
        var nodeUpdate = cmp.get("v.nodeUpdate");
        var node = cmp.get("v.body")[0].get("v.node");
        var preNodeUpdateCallback = cmp.get("v.body")[0].get('v.preNodeUpdateCallback');
        if (preNodeUpdateCallback && preNodeUpdateCallback() === true) {
            //preNodeUpdateCallback() should return true or false based on which we will actually run the nodeUpdate and close the panel
            nodeUpdate && nodeUpdate(node);
            helper.closePanel(cmp);
        }
    },

    handleCancel: function(cmp, event, helper) {
        // Add code for confirmation dialog after designs are available
        helper.closePanel(cmp);
    }

})