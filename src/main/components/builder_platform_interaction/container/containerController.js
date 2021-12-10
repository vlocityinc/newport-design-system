({
    handleGuardrailResult: function (cmp, event) {
        cmp.getEvent('guardrailsResult').setParams(event.getParams()).fire();
    }
});
