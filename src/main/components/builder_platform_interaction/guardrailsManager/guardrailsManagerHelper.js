/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    createGuardrailsPanel: function(cmp, isMinimized) {
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
                                flavor: 'medium, massError, noMaximize, launchMinimized',
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
                                }
                            })
                        })
                        .fire();
                }
            }
        );
    }
});
