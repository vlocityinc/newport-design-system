({
    onInit: function (cmp, event, helper) {
        helper.init(cmp);
        helper.handleInitOnboarding(cmp, event, helper);
        window.addEventListener('keydown', function (event) {
            /* Fix for @W-6426624: Error when pressing escape key in the "New Flow" modal */
            if (event.key === 'Escape') {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
            }
            /* /Fix */
        });
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
