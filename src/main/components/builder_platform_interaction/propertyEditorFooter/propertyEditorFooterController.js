({
    handleOk: function(cmp, event, helper) {
        $A.getEvt("markup://ui:getActivePanel").setParams({
            callback: function(activeModal) {
                helper.handleUpdateNodeOnOk(cmp, activeModal);
            }
        }).fire();
    },

    handleCancel: function(cmp, event, helper) {
        helper.closePanel(cmp);
    }
})