({
    onInit: function(cmp, event, helper) {
        helper.init(cmp);

        cmp.set('v.guardrailsParams', {
            enabled: false, // TODO perm on/off
            running: false, // TODO mute/unmuted
            count: 0
        });
    }
});
