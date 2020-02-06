({
    onInit: function(cmp, event, helper) {
        helper.init(cmp);

        cmp.set('v.guardrailsParams', {
            enabled: false, // TODO perm on/off
            running: false, // TODO mute/unmuted
            count: 0
        });
    },

    handleGuardrailResult: function(cmp, event, helper) {
        var result = event.getParam('guardrailsResult');
        // TODO integrate with client store/docking panel
        //console.log(result);
        var guardrailsParams = cmp.get('v.guardrailsParams');
        guardrailsParams.count = result ? result.length : 0;
        cmp.set('v.guardrailsParams', guardrailsParams);
    }
});
