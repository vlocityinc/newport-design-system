({
    /******************
     * Helper methods *
     ******************/

    /*
     * We're not expecting a real panel to be created
     * so let's just stick in a random component to make have guardrailsPanel be a valid cmp.
     */
    setDummyPanelCmp: function(cmp) {
        $A.createComponent(
            'lightning:button',
            {
                label: 'Substitute dummy component to represent a valid panel attribute'
            },
            function(button) {
                cmp.set('v.guardrailsPanel', button);
            }
        );
    },

    /******************
     *      Tests     *
     ******************/

    /**
     * If panel doesn't exist, handleGuardrailsResults should create one
     */
    testPanelCreated: {
        attributes: {},
        test: function(cmp) {
            var panelCreated = false;
            $A.test.addEventHandler('markup://force:showDockingPanel', function(event) {
                panelCreated = true;
            });
            cmp.controller.handleGuardrailsResults(cmp, {}, cmp.helper);

            $A.test.addWaitForWithFailureMessage(
                true,
                function() {
                    return panelCreated;
                },
                'showDockingPanel event did not fire'
            );
        }
    },

    /**
     * If panel already exists, handleGuardrailsResults should not create another one
     */
    testPanelNotRecreated: {
        attributes: {},
        test: function(cmp) {
            this.setDummyPanelCmp(cmp);
            var panelCreated = false;
            $A.test.addEventHandler('markup://force:showDockingPanel', function(event) {
                panelCreated = true;
            });

            $A.test.addWaitForWithFailureMessage(
                true,
                function() {
                    return !!cmp.get('v.guardrailsPanel');
                },
                'showDockingPanel event did not fire',
                function() {
                    cmp.controller.handleGuardrailsResults(cmp, {}, cmp.helper);
                    $A.test.assertFalse(panelCreated, 'showDockingPanel should not have been fired');
                }
            );
        }
    },

    /*
     * Check that for a given set of results, items and count are correctly set
     */
    // TODO
    _testGuardrailsResultsHandledCorrectly: {}
});
