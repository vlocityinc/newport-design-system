/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    init: function(cmp, event, helper) {
        if (cmp.get('v.consumerId')) {
            var mutePreference = new helper.guardrailsUtils.MutePreference(cmp.get('v.consumerId'));
            cmp.set('v.mutePreference', mutePreference);
            cmp.get('v.body')[0].set('v.guardrailsParams', { running: !mutePreference.isMuted() });
        }
    },

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
                if (cmp.get('v.mutePreference')) {
                    cmp.get('v.mutePreference').toggleMute(muted);
                }
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
