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
            cmp.get('v.flowId'),
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
        var debugWaitsBox = cmp.find('isDebugWaitsBox');
        var ignoreEntryCriteriaBox = cmp.find('isIgnoreEntryCriteriaCB');
        var dmlTypeRadio = cmp.find('debugCreateOrUpdate');
        var scheduledPathComboBox = cmp.find('scheduledPathComboBox');
        var debugInput = {
            inputs: helper.readAllInputs(cmp),
            runAs: cmp.get('v.shouldHasDebugAsUser') && cmp.find('isDebugAsUserAllowedBox').get('v.checked'),
            debugAsUserId: cmp.getDebugAsUserId(),
            enableRollback: cmp.find('isEnableRollbackModeBox').get('v.checked'),
            debugWaits: debugWaitsBox ? debugWaitsBox.get('v.checked') : false,
            ignoreEntryCriteria: ignoreEntryCriteriaBox ? ignoreEntryCriteriaBox.get('v.checked') : false,
            dmlType: dmlTypeRadio ? dmlTypeRadio.get('v.value') : '',
            scheduledPathSelection: scheduledPathComboBox ? scheduledPathComboBox.get('v.value') : ''
        };
        return debugInput;
    },

    handleRecordSelected: function (cmp, event, helper) {
        var source = event.getSource();

        if (!source) {
            return;
        }
        var values = source.get('v.values');
        var selectedEntityIndex = source.get('v.selectedEntityIndex');
        cmp.set('v.recordId', values[selectedEntityIndex].id);
        cmp.set('v.entityApiName', values[selectedEntityIndex].type);

        helper.updateShowDetails(cmp);
    },
    handleRecordRemoved: function (cmp, event, helper) {
        cmp.set('v.recordId', '');
        cmp.set('v.entityApiName', '');
        cmp.set('v.showDetails', false);
    },

    handleCreateOrUpdateRadioOnChange: function (cmp, event, helper) {
        helper.updateShowDetails(cmp);
    },

    handleScheduledPathSelect: function (cmp, event, helper) {
        helper.updateShowDetails(cmp);
    }
});
