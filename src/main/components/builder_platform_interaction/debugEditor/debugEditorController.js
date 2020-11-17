/*eslint-disable*/
({
    doInit: function (cmp, event, helper) {
        if (!cmp.get('v.rerun')) {
            helper.clearPreviousInputs();
        } else {
            helper.buildDebugAgainOptions(cmp);
        }
        helper.buildInput(
            cmp,
            cmp.get('v.flowName'),
            cmp.get('v.processType'),
            cmp.get('v.triggerType'),
            cmp.get('v.rerun')
        );
    },

    handleDebugAsUserCheck: function (cmp, event) {
        cmp.set('v.showDebugAsUserLookup', event.getParam('checked'));
        if (!cmp.get('v.showDebugAsUserLookup')) {
            // if unchecked, refresh search box by removing selected user
            cmp.set('v.runAsSelected', null);
        }
    },

    getDebugAsUserId: function (cmp) {
        if (cmp.get('v.showIsDebugAsUserAllowed') && cmp.get('v.showDebugAsUserLookup')) {
            var values = cmp.find('debugAsUserList').get('v.values');
            return values[0] ? values[0].id : null;
        }
        return null;
    },

    getDebugInput: function (cmp, event, helper) {
        var debugInput = {
            inputs: helper.readAllInputs(cmp),
            runAs: cmp.get('v.shouldHasDebugAsUser') && cmp.find('isDebugAsUserAllowedBox').get('v.checked'),
            debugAsUserId: cmp.getDebugAsUserId(),
            enableRollback: cmp.find('isEnableRollbackModeBox').get('v.checked'),
            governorLimits: cmp.find('isGovernorLimitsBox').get('v.checked')
        };
        return debugInput;
    }
});