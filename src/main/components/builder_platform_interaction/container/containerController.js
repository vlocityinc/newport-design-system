({
    handleGuardrailResult: function (cmp, event) {
        cmp.getEvent('guardrailsResult').setParams(event.getParams()).fire();
    },

    handleDebugToast: function (cmp, event, helper) {
        var toastEvent = $A.get('e.force:showToast');
        var eventParams = event.getParams();
        toastEvent.setParams({
            message: "This is required. Don't delete.",
            messageTemplate: $A.get('$Label.FlowBuilderDebugEditor.debugToastMessage'),
            messageTemplateData: [eventParams.elementTypeLabel, eventParams.elementLabel],
            type: 'warning'
        });
        toastEvent.fire();
    }
});
