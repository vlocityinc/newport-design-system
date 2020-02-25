/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    createGuardrailsPanel: function(cmp, isMinimized) {
        if (!cmp.get('v.isCreatingPanel')) {
            $A.createComponent(
                'analyzer_framework:badgeCount',
                {
                    count: cmp.getReference('v.count')
                },
                function(badgeCount) {
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
                                onCreate: $A.getCallback(function(guardrailsPanel) {
                                    if (guardrailsPanel) {
                                        cmp.set('v.guardrailsPanel', guardrailsPanel);
                                        cmp.set('v.isCreatingPanel', false);
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

    processResults: function(cmp, report) {
        var processedResults = this.guardrailsUtils.processReport(report);
        this.updateItems(cmp, processedResults);
    },

    updateItems: function(cmp, results) {
        cmp.set('v.items', results);
        cmp.set('v.count', results.length);
    }
});
