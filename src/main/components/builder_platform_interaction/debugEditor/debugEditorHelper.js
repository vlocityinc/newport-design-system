/*eslint-disable*/
({
    /**
     * Call out to FlowBuilderController and construct debug modal with input vars
     * @param {Aura} cmp, the debug modal
     * @param {String} flowName
     * @param {Boolean} rerun, whether this is a debug rerun
     */
    buildInput: function (cmp, flowName, flowId, processType, triggerType, rerun) {
        this.getDebugRunAsValidation(cmp, processType, triggerType);

        if (processType === 'AutoLaunchedFlow' && triggerType === 'Scheduled') {
            cmp.set('v.shouldHasInputs', false);
        } else if (processType === 'AutoLaunchedFlow' && this.isRecordChangeTriggerType(triggerType)) {
            var action = cmp.get('c.getDollarRecordInputVariable');
            action.setParams({ flowId: flowId });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === 'SUCCESS') {
                    this.buildInputVarComponents(cmp, response.getReturnValue(), rerun);
                }
                cmp.set('v.displaySpinner', false);
            });
            $A.enqueueAction(action);
            cmp.set('v.shouldHasInputs', true);
            cmp.set('v.isDMLTrigger', true);
            cmp.set('v.enableRollbackCB', true);
            cmp.set('v.createOrUpdateOptions', this.getCreateOrUpdateOptions());
        } else {
            var action = cmp.get('c.getFlowInputOutputVariables');
            action.setParams({ flowName: flowName });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === 'SUCCESS') {
                    this.buildInputVarComponents(cmp, response.getReturnValue()[0], rerun);
                }
                cmp.set('v.displaySpinner', false);
            });
            $A.enqueueAction(action);
            cmp.set('v.shouldHasInputs', true);
        }
    },

    isRecordChangeTriggerType: function (triggerType) {
        return (
            triggerType === 'RecordAfterSave' ||
            triggerType === 'RecordBeforeSave' ||
            triggerType === 'RecordBeforeDelete'
        );
    },

    /**
     * Construct retrieved input vars as flowruntime:<input_datattype> components and add to modal body
     * The input vars may come from previous debug run's inputs if this is a debug rerun
     * @param {Aura} cmp, the debug modal component
     * @param {Object} data, the object returned from FlowBuilderController.getFlowInputOutputVariables
     * @param {Boolean} rerun, whether this is a debug rerun
     */
    buildInputVarComponents: function (cmp, data, rerun) {
        var content = cmp.find('flowInput');
        var body = content.get('v.body');
        var hasInputs = false;
        var prevOrDefaultInputs = rerun && this.previousInputs.length > 0 ? this.previousInputs : data.variables;
        for (var i = 0; i < prevOrDefaultInputs.length; i++) {
            var currentVar = prevOrDefaultInputs[i];
            var childComp = this._createSimpleInput(cmp, currentVar);
            if (childComp) {
                // undefined for unsupported input types
                body.push(childComp);
                childComp._argument = currentVar;
                hasInputs = true;
            }
        }
        content.set('v.body', body);
        cmp.set('v.hasInputs', hasInputs);
    },

    /**
     * On clicking Run, read all user inputs and only return those with given values
     * Also save all null/non-null input vars into previousInputs
     * Also save all debug options (runAs, enableRollback, etc) into previousOptions
     * @param {Aura} cmp, the debug modal
     *
     * @returns {Object} arg, all the input variables with non-null values
     */
    readAllInputs: function (cmp) {
        var content = cmp.find('flowInput');
        var body = content.get('v.body');
        var args = [];
        this.clearPreviousInputs();
        this.storePreviousDebugOptions(cmp);
        for (var i = 0; i < body.length; i++) {
            if (body[i].isInstanceOf('flowruntime:screenInput')) {
                var argu = body[i]._argument;
                var value = body[i].get('v.value');
                if (this._isValueSet(value)) {
                    args.push({ name: argu.name, type: argu.dataType, value: value });
                } else {
                    value = null;
                }
                this.previousInputs.push({
                    name: argu.name,
                    dataType: argu.dataType,
                    value: value,
                    isInput: argu.isInput,
                    isOutput: argu.isOutput,
                    isCollection: argu.isCollection,
                    objectType: argu.objectType
                });
                //if record is updated, provide updates AND recordId in args.value
                if (cmp.get('v.showDetails')) {
                    var recordChanges = cmp.find('recordDetails').get('v.fieldUpdates');
                    recordChanges['Id'] = value;
                    args[0].value = recordChanges;
                }
            }
        }
        return args;
    },

    /**
     * Make a call to FlowBuilderController.debugRunAsValidation to ascertain if run as feature is enabled
     *
     * Set showIsDebugAsUserAllowed - is run as feature enabled in org?
     * Set showIsDebugAsUserAllowedInNonPrd - is this an inactive org? Only inactive orgs can run as
     * @param {Aura} cmp, the debug modal
     */
    getDebugRunAsValidation: function (cmp, processType, triggerType) {
        if (processType === 'AutoLaunchedFlow' && triggerType === 'Scheduled') {
            cmp.set('v.shouldHasDebugAsUser', false);
        } else {
            cmp.set('v.shouldHasDebugAsUser', true);
            var action = cmp.get('c.debugRunAsValidation');
            var flowDevName = cmp.get('v.flowName');
            var flowVersionId = cmp.get('v.flowId');
            action.setParams({ flowVersionId: flowVersionId, flowDevName: flowDevName });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === 'SUCCESS') {
                    var validationMap = response.getReturnValue();
                    cmp.set('v.showIsDebugAsUserAllowed', validationMap['showIsDebugAsUserAllowed']);
                    cmp.set('v.showIsDebugAsUserAllowedInNonPrd', validationMap['showIsDebugAsUserAllowedInNonPrd']);
                }
                this.setRunAsHelptext(cmp);
            });
            $A.enqueueAction(action);
        }
    },

    /**
     * Based on values set in getDebugRunAsValidation, populated helptext next to run as checkbox
     * @param {Aura} cmp, the debug modal
     */
    setRunAsHelptext: function (cmp) {
        var isDebugAsUserAllowed = cmp.get('v.showIsDebugAsUserAllowed');
        var isDebugAsUserAllowedInNonPrd = cmp.get('v.showIsDebugAsUserAllowedInNonPrd');
        if (isDebugAsUserAllowed && isDebugAsUserAllowedInNonPrd) {
            cmp.set('v.runAsHelptext', $A.get('$Label.FlowDebug.ShowDebugAsUserHelp'));
        } else if (!isDebugAsUserAllowedInNonPrd) {
            cmp.set('v.runAsHelptext', $A.get('$Label.FlowDebug.ShowDebugAsUserDisabledHelpInPrdOrg'));
        } else {
            cmp.set('v.runAsHelptext', $A.get('$Label.FlowDebug.ShowDebugAsUserDisabledHelp'));
        }
    },

    /**
     * If this is a debug rerun, set the checkbox values based off of saved previousOptions
     * If runAs checkbox was checked, populated lookup input with previously selected user
     * @param {Aura} cmp, the debug modal
     */
    buildDebugAgainOptions: function (cmp) {
        if (this.previousOptions) {
            cmp.set('v.debugWaitsCB', this.previousOptions.debugWaits);
            cmp.set('v.enableRollbackCB', this.previousOptions.enableRollback);
            cmp.set('v.runAsCB', this.previousOptions.runAs);
            cmp.set('v.showDebugAsUserLookup', this.previousOptions.runAs);
            cmp.set('v.saveType', this.previousOptions.saveType);
            cmp.set('v.recordId', this.previousOptions.recordId);
            cmp.set('v.entityApiName', this.previousOptions.entityApiName);
            cmp.set('v.showDetails', this.previousOptions.showDetails);
            cmp.set('v.ignoreEntryCriteria', this.previousOptions.ignoreEntryCriteria);
            if (cmp.get('v.showDebugAsUserLookup')) {
                cmp.set('v.runAsSelected', this.previousOptions.runAsSelected);
            }
            if (cmp.get('v.showScheduledPathComboBox')) {
                cmp.find('scheduledPathComboBox').set('v.value', this.previousOptions.scheduledPathSelection);
            }
        }
    },

    _isValueSet: function (value) {
        return value || value === 0; // any non-zero length string, object, number (including 0), or true (but not false)
    },

    /**
     * Map for all flowruntime namespaced input datatypes
     */
    _typeMap: {
        String: 'textInput',
        Number: 'numberInput',
        Boolean: 'checkboxInput',
        Date: 'dateInput',
        DateTime: 'dateTimeInput',
        Currency: 'currencyInput',
        Picklist: 'textInput',
        Multipicklist: 'textInput',
        SObject: 'lookupInput'
    },

    /**
     * Construct given input argument as a flowruntime:<input_datatype> aura component
     * input variables of unsupported type (collection, Apex) are omitted
     * @param {Object} argument, the input var (can be from previousInputs array or FlowBuilderController call)
     *
     * @return {Aura} field, the flowruntime:<input_datatype> component
     */
    _createSimpleInput: function (cmp, argument) {
        if (argument.isCollection === true || argument.isInput === false) {
            return undefined; // unsupported
        }
        var compType = this._typeMap[argument.dataType];
        if (!compType) {
            return undefined; // unsupported
        }
        var descriptor = 'flowruntime:' + compType;

        var attributes =
            argument.dataType != 'SObject'
                ? {
                      name: argument.name,
                      label: argument.name,
                      isRequired: false,
                      errorMessage: null,
                      value: argument.value,
                      helpText: null,
                      triggersUpdate: false
                  }
                : argument.name === '$Record'
                ? {
                      name: argument.name,
                      label: cmp.get('v.dollarRecordName'),
                      searchEntities: [{ name: argument.objectType }],
                      isRequired: true,
                      helpText: null,
                      errorMessage: null,
                      triggerUpdate: false,
                      value: argument.value
                  }
                : {
                      name: argument.name,
                      label: argument.name,
                      searchEntities: [{ name: argument.objectType }],
                      isRequired: false,
                      helpText: null,
                      errorMessage: null,
                      triggerUpdate: false,
                      value: argument.value
                  };

        var field;
        $A.createComponent(descriptor, attributes, function (newCmp) {
            field = newCmp;
        });
        return field;
    },

    /**
     * Called if this is not a debug rerun
     * Clear saved previousInputs and previousOptions
     */
    clearPreviousInputs: function () {
        this.previousInputs = [];
        this.previousOptions = null;
    },

    /**
     * When reading all inputs, save the debug options into previousOptions
     * @param {Aura} cmp, the debug modal
     */
    storePreviousDebugOptions: function (cmp) {
        var selectedUser = null;
        if (cmp.get('v.shouldHasDebugAsUser') && cmp.get('v.showDebugAsUserLookup')) {
            // if checked, retrieve runAsUser
            selectedUser = cmp.get('v.runAsSelected');
        }

        var debugWaitsBox = cmp.find('isDebugWaitsBox');
        var saveTypeRadio = cmp.find('debugCreateOrUpdate');
        var ignoreEntryCriteriaBox = cmp.find('isIgnoreEntryCriteriaCB');
        var scheduledPathComboBox = cmp.find('scheduledPathComboBox');
        this.previousOptions = {
            runAs: cmp.get('v.shouldHasDebugAsUser') && cmp.find('isDebugAsUserAllowedBox').get('v.checked'),
            runAsSelected: selectedUser,
            enableRollback: cmp.find('isEnableRollbackModeBox').get('v.checked'),
            debugWaits: debugWaitsBox ? debugWaitsBox.get('v.checked') : false,
            saveType: saveTypeRadio ? saveTypeRadio.get('v.value') : this.CREATE,
            ignoreEntryCriteria: ignoreEntryCriteriaBox ? ignoreEntryCriteriaBox.get('v.checked') : false,
            scheduledPathSelection: scheduledPathComboBox ? scheduledPathComboBox.get('v.value') : '',
            recordId: cmp.get('v.recordId'),
            entityApiName: cmp.get('v.entityApiName'),
            showDetails: cmp.get('v.showDetails')
        };
    },

    /**
     * Preserve the previous input variables for Debug Again
     */
    previousInputs: [],

    /**
     * Preserve the previous debug options for Debug Again
     */
    previousOptions: null,

    CREATE: 'Create',
    UPDATE: 'Update',

    getCreateOrUpdateOptions: function () {
        return [
            { label: $A.get('{!$Label.FlowDebug.DMLCreate}'), value: this.CREATE },
            { label: $A.get('{!$Label.FlowDebug.DMLUpdate}'), value: this.UPDATE }
        ];
    },

    /** Show details set to true if save type is update, a record is selected,
     *  and the scheduled path type is after commit or immediate.
     */
    updateShowDetails: function (cmp) {
        // get metadata for constants
        var flowMetadata = cmp.find('flowMetadata');
        // check trigger type
        // if createAndUpdate then look for radio button, else if not update then return
        var recordTriggerType = cmp.get('v.recordTriggerType');

        if (recordTriggerType === flowMetadata.FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE) {
            // radio button
            var dmlTypeRadio = cmp.find('debugCreateOrUpdate');
            var createOrUpdate = dmlTypeRadio ? dmlTypeRadio.get('v.value') : '';

            if (createOrUpdate !== this.UPDATE) {
                cmp.set('v.showDetails', false);
                return;
            }
        } else if (recordTriggerType !== flowMetadata.FLOW_TRIGGER_SAVE_TYPE.UPDATE) {
            cmp.set('v.showDetails', false);
            return;
        }

        if (cmp.get('v.showScheduledPathComboBox')) {
            var pathType = cmp.find('scheduledPathComboBox').get('v.value');

            // only show if after commit or immediate
            if (
                pathType !== flowMetadata.SCHEDULED_PATH_TYPE.RUN_ASYNC &&
                pathType !== flowMetadata.SCHEDULED_PATH_TYPE.IMMEDIATE_SCHEDULED_PATH
            ) {
                cmp.set('v.showDetails', false);
                return;
            }
        }

        var recordId = cmp.get('v.recordId');
        if (!recordId) {
            cmp.set('v.showDetails', false);
            return;
        }

        cmp.set('v.showDetails', true);
    }
});
