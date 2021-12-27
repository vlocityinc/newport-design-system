// @ts-nocheck
import { compareParamsByLabel, compareParamsByRequired } from 'builder_platform_interaction/calloutEditorLib';
import { DynamicTypeMappingChangeEvent } from 'builder_platform_interaction/events';
import ManuallyAssignVariablesCheckbox from 'builder_platform_interaction/manuallyAssignVariablesCheckbox';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { multiComparator } from 'builder_platform_interaction/sortLib';
import { api, LightningElement, track } from 'lwc';

export default class ParameterList extends LightningElement {
    @track
    state = {
        automaticOutputHandlingSupported: false,
        inputs: [],
        outputs: [],
        storeOutputAutomatically: false
    };

    /**
     * Input header title
     *
     */
    @api
    inputHeader;

    /**
     * Output header title
     *
     */
    @api
    outputHeader;

    /**
     * Title message when there is no input.
     *
     */
    @api
    emptyInputsTitle;

    /**
     * Body message when there is no input.
     *
     */
    @api
    emptyInputsBody;

    /**
     * Body when there is no input and no output.
     *
     */
    @api
    emptyInputsOutputsBody;

    /**
     * Title when there is no outputs and no inputs.
     *
     */
    @api
    emptyInputsOutputsTitle;

    /**
     * Name of configuration editor associated with a component. It is null if it is not defined
     *
     * @memberof BaseCalloutEditor
     */
    @api
    configurationEditor;

    /**
     * Information about the action element in which the configurationEditor is defined
     */
    @api
    elementInfo;

    /**
     * Builder Context for CPE
     */
    @api
    builderContext;

    /**
     * List of dynamic type mappings for configuration editor
     */
    @api
    configurationEditorTypeMappings;

    /*
     * Object of automatic output variables in flow
     */
    @api
    automaticOutputVariables;

    @api
    displayOutputParams;

    /**
     * List of input ParameterItem
     *
     */
    set inputs(newInputs) {
        this.state.inputs = newInputs || [];
    }

    @api
    get inputs() {
        return this.state.inputs;
    }

    /**
     * List of output ParameterItem
     *
     */
    set outputs(newOutputs) {
        this.state.outputs = newOutputs || [];
    }

    @api
    get outputs() {
        return this.state.outputs;
    }

    set storeOutputAutomatically(newValue) {
        this.state.storeOutputAutomatically = newValue;
    }

    @api
    get storeOutputAutomatically() {
        return this.state.storeOutputAutomatically;
    }

    set automaticOutputHandlingSupported(newValue) {
        this.state.automaticOutputHandlingSupported = newValue;
    }

    @api
    get automaticOutputHandlingSupported() {
        return this.state.automaticOutputHandlingSupported;
    }

    /**
     * Type of element
     *
     */
    @api
    elementType;

    /**
     * rules for input parameters
     *
     */
    get inputRules() {
        return getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementType);
    }

    get emptyInputs() {
        return this.state.inputs.length === 0;
    }

    get emptyInputsWithOutputs() {
        return this.emptyInputs && !this.emptyOutputs;
    }

    get emptyOutputs() {
        return this.state.outputs.length === 0;
    }

    get emptyInputsAndOutputs() {
        return this.emptyInputs && this.emptyOutputs;
    }

    get hasConfigurationEditor() {
        return !!this.configurationEditor;
    }

    /**
     * true if input parameters need to be sorted
     *
     */
    @api
    sortInputs = false;

    /**
     * true if output parameters need to be sorted
     *
     */
    @api
    sortOutputs = false;

    /**
     * @typedef {Object} ParameterItemWarning warning configuration for a ParameterItem component
     * @property {string} warningBadge the badge text
     * @property {string} warningMessage the warning message
     * @property {boolean} shouldBeDeleted true if deleting the row would resolve the warning
     * @typedef {Object.<string, ParameterItemWarning>} ParameterListWarnings warnings for ParameterList component
     * The key is the rowIndex of the ParameterItem.
     */

    /**
     * @type {ParameterListWarnings} the warnings for the parameters
     */
    @api
    warnings = {};

    @api
    configurationEditorInputVariables;

    @api
    configurationEditorAllInputVariables;

    @api
    validate() {
        if (this.hasConfigurationEditor) {
            const customPropertyEditor = this.template.querySelector(
                'builder_platform_interaction-custom-property-editor'
            );
            if (customPropertyEditor) {
                return customPropertyEditor.validate();
            }
        }
        return [];
    }

    get sortedInputsWithWarnings() {
        const sortedInputs = this.sortInputs
            ? this.state.inputs.slice().sort(multiComparator([compareParamsByRequired, compareParamsByLabel]))
            : this.state.inputs;
        return sortedInputs.map((item) => ({
            item,
            warning: this.warnings[item.rowIndex] || {}
        }));
    }

    get sortedOutputsWithWarnings() {
        const sortedOutputs = this.sortOutputs
            ? this.state.outputs.slice().sort(compareParamsByLabel)
            : this.state.outputs;
        return sortedOutputs.map((item) => ({
            item,
            warning: this.warnings[item.rowIndex] || {}
        }));
    }

    /**
     * @returns {boolean} true : the user chooses to use the Advanced Options or if the process type does not support the automatic output handling
     */
    get isAdvancedMode() {
        return !this.state.storeOutputAutomatically || !this.automaticOutputHandlingSupported;
    }

    /**
     * The CSS depends on the automatic output handling supports.
     *
     * @returns {string} "slds-p-left_xx-large slds-p-right_small" : if the automatic output handling is supported
     * @returns {string}
     * "slds-p-left_x-large slds-p-right_small" : if custom property editor exists
     * "slds-p-left_xx-large slds-p-right_small" : if the automatic output handling is supported
     */
    get cssDivAdvancedMode() {
        if (this.hasConfigurationEditor) {
            return 'slds-p-left_x-large slds-p-right_small';
        }
        return this.automaticOutputHandlingSupported ? 'slds-p-left_xx-large slds-p-right_small' : 'slds-p-right_small';
    }

    /**
     * This helper method helps to determine if we need to show output parameter in case of invocable action editor
     * and other components that uses this component.
     */
    get showOutputParam() {
        return this.displayOutputParams && !this.emptyOutputs;
    }

    get advancedOptionsCheckboxDivCss() {
        return this.configurationEditor
            ? 'slds-form_stacked slds-m-top_medium'
            : ManuallyAssignVariablesCheckbox.DEFAULT_INPUT_PARENT_DIV_CSS;
    }

    /**
     * @param {object} event - type mapping changed event coming from parameter dynamic type of custom property editor
     */
    handleCpeTypeMappingChangeEvent(event) {
        event.stopPropagation();
        if (event && event.detail) {
            const { typeName, typeValue } = event.detail;
            this.dispatchEvent(
                new DynamicTypeMappingChangeEvent({
                    typeName,
                    typeValue,
                    isConfigurable: true
                })
            );
        }
    }
}
