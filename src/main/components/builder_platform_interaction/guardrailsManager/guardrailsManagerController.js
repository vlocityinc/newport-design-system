/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    handleGuardrailsResults: function(cmp, event, helper) {
        var eventParams = event.getParams();
        var report = eventParams.guardrailsResult.results;
        var hasNewResults = helper.processResults(cmp, report);

        if (hasNewResults) {
            var panel = cmp.get('v.guardrailsPanel');
            if (!panel || (panel && !panel.isValid())) {
                helper.createGuardrailsPanel(cmp, true);
            }
        }
    },

    handleToggleGuardrails: function(cmp, event, helper) {
        event.stopPropagation();

        var muted = event.detail.muted;
        var panel = cmp.get('v.guardrailsPanel');

        switch (muted) {
            case true:
                if (panel && panel.isValid()) {
                    panel.closePanel();
                }
            case false:
                helper.updateItems(cmp, [], muted);
                cmp.set('v.needToFocus', true);
                break;
            default:
                if (!panel || (panel && !panel.isValid())) {
                    helper.createGuardrailsPanel(cmp, false);
                } else {
                    panel.show();
                }
        }
    }
});
