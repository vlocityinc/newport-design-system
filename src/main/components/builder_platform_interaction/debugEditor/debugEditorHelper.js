({
    // Build screen for all input variables and get debugRunAs validation result
    buildInput: function(cmp, flowName) {
        var action = cmp.get('c.getFlowInputOutputVariables');
        action.setParams({ flowName: flowName });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                this.buildInputVarComponents(cmp, response.getReturnValue()[0]);
            }
        });
        $A.enqueueAction(action);
        this.getDebugRunAsValidation(cmp);
    },

    buildInputVarComponents: function(cmp, data) {
        var content = cmp.find('flowInput');
        var body = content.get('v.body');
        var hasInputs = false;
        for (var i = 0; i < data.variables.length; i++) {
            var currentVar = data.variables[i];
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

    readAllInputs: function(cmp) {
        var content = cmp.find('flowInput');
        var body = content.get('v.body');
        var args = [];
        for (var i = 0; i < body.length; i++) {
            if (body[i].isInstanceOf('flowruntime:screenInput')) {
                var argu = body[i]._argument;
                var value = body[i].get('v.value');
                if (this._isValueSet(value)) {
                    args.push({ name: argu.name, type: argu.dataType, value: value });
                }
            }
        }
        return args;
    },

    getDebugRunAsValidation: function(cmp) {
        var action = cmp.get('c.debugRunAsValidation');
        var flowDevName = cmp.get('v.flowName');
        var flowVersionId = cmp.get('v.flowId');
        action.setParams({ flowVersionId: flowVersionId, flowDevName: flowDevName });
        action.setCallback(this, function(response) {
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

    setRunAsHelptext: function(cmp) {
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

    _isValueSet: function(value) {
        return value || value === 0; // any non-zero length string, object, number (including 0), or true (but not false)
    },

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

    // input variables of unsupported type (collection, Apex) are omitted
    _createSimpleInput: function(argument) {
        if (argument.isCollection === true) {
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
                      triggerUpdate: false
                  }
                : {
                      name: argument.name,
                      label: argument.name,
                      isRequired: false,
                      errorMessage: null,
                      value: null, // default value not returned in getFlowInputOutputVariables
                      helpText: null,
                      triggersUpdate: false
                  };

        var field;
        $A.createComponent(descriptor, attributes, function(newCmp) {
            field = newCmp;
        });
        return field;
    }
});
