({
    handleGuardrailResult: function (cmp, event) {
        cmp.getEvent('guardrailsResult').setParams(event.getParams()).fire();
    },

    handleDebugToast: function (cmp, event, helper) {
        var toastEvent = $A.get('e.force:showToast');
        var eventParams = event.getParams();
        var messageTemplate = eventParams.elementLabel
            ? $A.get('$Label.FlowBuilderDebugEditor.debugToastMessage')
            : $A.get('$Label.FlowBuilderDebugEditor.debugToastMessageNoElementLabel');
        var messageTemplateData = eventParams.elementLabel
            ? [eventParams.elementTypeLabel, eventParams.elementLabel]
            : [eventParams.elementTypeLabel];
        toastEvent.setParams({
            message: "This is required. Don't delete.",
            messageTemplate: messageTemplate,
            messageTemplateData: messageTemplateData,
            type: 'warning'
        });
        toastEvent.fire();
    }
});
