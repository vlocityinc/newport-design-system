/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    handleGuardrailsResults: function(cmp, event, helper) {
        var eventParams = event.getParams();
        var report = eventParams.guardrailsResult.results;
        helper.processResults(cmp, report);

        // if panel doesn't already exist and there are items to show, create it!
        if (cmp.get('v.count')) {
            var panel = cmp.get('v.guardrailsPanel');
            if (!panel || (panel && !panel.isValid())) {
                helper.createGuardrailsPanel(cmp, true);
            }
        }
    }

    // TODO W-7222399 view tips from help menu
    // openPanel : function(cmp, event, helper) {
    //     cmp.get('v.body')[0].set('v.guardrailsParams', true);
    //     var panel = cmp.get('v.guardrailsPanel');
    //     if (!panel || (panel && !panel.isValid())) {
    //         helper.createGuardrailsPanel(cmp, false);
    //     } else [
    //         panel.show();
    //     ]
    // }

    // TODO W-7222399 mute guardrails - something like this?
    // muteGuardrails : function(cmp, event, helper) {
    //     cmp.get('v.body')[0].set('v.guardrailsParams', params.running = false);
    // }
});
