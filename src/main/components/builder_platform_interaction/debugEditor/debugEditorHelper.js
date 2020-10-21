/*eslint-disable*/
({
    /**
     * Call out to FlowBuilderController and construct debug modal with input vars
     * @param {Aura} cmp, the debug modal
     * @param {String} flowName
     * @param {Boolean} rerun, whether this is a debug rerun
     */
    buildInput: function (cmp, flowName, processType, triggerType, rerun) {
        this.getDebugRunAsValidation(cmp);

        if (processType === 'AutoLaunchedFlow' && triggerType === 'Scheduled') {
            cmp.set('v.shouldHasInputs', false);
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
            var childComp = this._createSimpleInput(currentVar);
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
    getDebugRunAsValidation: function (cmp) {
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
            cmp.set('v.enableRollbackCB', this.previousOptions.enableRollback);
            cmp.set('v.govLimsCB', this.previousOptions.governorLimits);
            cmp.set('v.runAsCB', this.previousOptions.runAs);
            cmp.set('v.showDebugAsUserLookup', this.previousOptions.runAs);
            if (cmp.get('v.showDebugAsUserLookup')) {
                cmp.set('v.runAsSelected', this.previousOptions.runAsSelected);
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
    _createSimpleInput: function (argument) {
        if (argument.isCollection === true || argument.isInput === false) {
            return undefined; // unsupported
        }
        var compType = this._typeMap[argument.dataType];
        if (!compType) {
            return undefined; // unsupported
        }
        var descriptor = 'flowruntime:' + compType;

        var attributes =
            argument.dataType === 'SObject'
                ? {
                      name: argument.name,
                      label: argument.name,
                      searchEntities: [{ name: argument.objectType }],
                      isRequired: false,
                      helpText: null,
                      errorMessage: null,
                      triggerUpdate: false,
                      value: argument.value
                  }
                : {
                      name: argument.name,
                      label: argument.name,
                      isRequired: false,
                      errorMessage: null,
                      value: argument.value,
                      helpText: null,
                      triggersUpdate: false
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
        if (cmp.get('v.showDebugAsUserLookup')) {
            // if checked, retrieve runAsUser
            selectedUser = cmp.get('v.runAsSelected');
        }
        this.previousOptions = {
            runAs: cmp.find('isDebugAsUserAllowedBox').get('v.checked'),
            runAsSelected: selectedUser,
            enableRollback: cmp.find('isEnableRollbackModeBox').get('v.checked'),
            governorLimits: cmp.find('isGovernorLimitsBox').get('v.checked')
        };
    },

    /**
     * Preserve the previous input variables for Debug Again
     */
    previousInputs: [],

    /**
     * Preserve the previous debug options for Debug Again
     */
    previousOptions: null
});
