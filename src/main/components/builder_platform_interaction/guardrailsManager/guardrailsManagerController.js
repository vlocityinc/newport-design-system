/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    handleGuardrailsResults: function(cmp, event, helper) {
        // TODO W-7222391 update attributes based on engine results
        // var count = eventParams.count;
        // var items = eventParams.items;
        // cmp.set('v.count', count);
        // cmp.set('v.items', items);

        // if panel doesn't already exist and there are items to show, create it!
        // TODO check items.length/count > 0 first
        var panel = cmp.get('v.guardrailsPanel');
        if (!panel || (panel && !panel.isValid())) {
            helper.createGuardrailsPanel(cmp, true);
        }
    }

    // TODO W-7222399 view tips from help menu
    // openPanel : function(cmp, event, helper) {
    //     cmp.get('v.body')[0].set('v.guardrailsParams', true);
    //     var panel = cmp.get('v.guardrailsPanel');
    //     if (!panel || (panel && !panel.isValid())) {
    //         helper.createGuardrailsPanel(cmp, true);
    //     } else [
    //         panel.show();
    //     ]
    // }

    // TODO W-7222399 mute guardrails - something like this?
    // muteGuardrails : function(cmp, event, helper) {
    //     cmp.get('v.body')[0].set('v.guardrailsParams', params.running = false);
    // }
});
