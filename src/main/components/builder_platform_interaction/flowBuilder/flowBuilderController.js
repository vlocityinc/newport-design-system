({
    onInit: function (cmp, event, helper) {
        helper.init(cmp);
    },
    handleSystemError: function (cmp, event, helper) {
        var params = event.getParams() || {};
        var message = params.message;
        var error = params.auraError || new Error(message);
        var gackId = error.id;
        if (event['handled']) {
            return;
        }
        event['handled'] = true;
        $A.util.squash(event);
        helper.invokeAlertModal(cmp, message, gackId);
    },
    handleCustomerError: function (cmp, event, helper) {
        var params = event.getParams() || {};
        var message = params.message;
        var error = params.auraError || new Error(message);
        var gackId = error.id;
        if (event['handled']) {
            return;
        }
        event['handled'] = true;
        $A.util.squash(event);
        helper.invokeAlertModal(cmp, message, gackId);
    }
});
