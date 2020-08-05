/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    createGuardrailsPanel: function (cmp, isMinimized) {
        if (!cmp.get('v.isCreatingPanel')) {
            $A.createComponent(
                'analyzer_framework:badgeCount',
                {
                    count: cmp.getReference('v.count')
                },
                function (badgeCount) {
                    if (badgeCount) {
                        $A.getEvt('markup://force:showDockingPanel')
                            .setParams({
                                componentDef: 'analyzer_framework:resultCardsContainer',
                                attributes: {
                                    items: cmp.getReference('v.items'),
                                    emptyStateTitle: $A.get('$Label.FlowBuilderGuardrails.emptyGuardrailsTitle'),
                                    emptyStateMessage: $A.get('$Label.FlowBuilderGuardrails.emptyGuardrailsMessage')
                                },
                                panelConfig: {
                                    flavor: 'noMaximize, launchMinimized',
                                    title: $A.get('$Label.FlowBuilderGuardrails.dockingPanelTitle'),
                                    titleSuffixCmp: badgeCount,
                                    class: 'guardrails',
                                    icon: 'sossession',
                                    keyboardShortcut: 'GoToPrompt',
                                    loadMinimized: isMinimized
                                },
                                onCreate: $A.getCallback(function (guardrailsPanel) {
                                    if (guardrailsPanel) {
                                        cmp.set('v.guardrailsPanel', guardrailsPanel);
                                        cmp.set('v.isCreatingPanel', false);
                                        if (cmp.get('v.needToFocus')) {
                                            guardrailsPanel.focus();
                                            cmp.set('v.needToFocus', false);
                                        }
                                    }
                                })
                            })
                            .fire();
                    }
                }
            );
            cmp.set('v.isCreatingPanel', true);
        }
    },

    /**
     * @return {boolean} whether there are any new reesults
     **/
    processResults: function (cmp, report) {
        var prevResults = cmp.get('v.items');
        var newResults = this.guardrailsUtils.processReport(report);
        this.updateItems(cmp, newResults);

        return this.guardrailsUtils.hasNewResults(prevResults, newResults);
    },

    updateItems: function (cmp, results, mute) {
        cmp.set('v.items', results);
        var count = results.length;
        cmp.set('v.count', count);
        cmp.get('v.body')[0].set('v.guardrailsParams', { running: !mute, count: count });
    }
});
