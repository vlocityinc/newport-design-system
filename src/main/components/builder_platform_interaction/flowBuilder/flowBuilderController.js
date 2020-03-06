({
    onInit: function(cmp, event, helper) {
        helper.init(cmp);

        cmp.set('v.guardrailsParams', {
            running: true // TODO mute/unmuted via browser storage
        });
    }
});
