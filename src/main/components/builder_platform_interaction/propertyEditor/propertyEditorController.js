({
    onInit: function(cmp, event, helper) {
        helper.init(cmp);
    },

    handleOk: function(cmp, event, helper) {
        // TODO: Once the resource editor body is finalized remove this check.
        if (cmp.get("v.titleForModal") === 'New Resource'){
            helper.closePanel(cmp);
        } else{
            var nodeUpdate = cmp.get("v.nodeUpdate");
            var node = cmp.get("v.body")[0].getNode();
            var validationErrors = cmp.get("v.body")[0].validate();
            if (validationErrors) {
                if (node && nodeUpdate && validationErrors.length === 0) {
                    nodeUpdate(node);
                    helper.closePanel(cmp);
                } else if (validationErrors.length > 0 ) {
                    // TODO: Set errors to show up on the "!" component next to ok cancel button
                }
            }
        }
    },

    handleCancel: function(cmp, event, helper) {
        helper.closePanel(cmp);
    }
})