import { LightningElement, api, track } from 'lwc';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';

export default class BaseCalloutEditor extends LightningElement {
    @track state = {
        inputs: [],
        outputs: [],
    }
    /**
     * Config for label-description component. For example {name: actionNode.name, label: actionNode.label, description: actionNode.label, guid: actionNode.guid}
     *
     */
    @api labelDescriptionConfig;

    /**
     * Modal subtitle
     *
     */
    @api subtitle;

    /**
     * Input tab header title
     *
     */
    @api inputTabHeader;

    /**
     * Output tab header title
     *
     */
    @api outputTabHeader;

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

    /**
     * Type of element
     *
     */
    @api
    elementType;

    /**
     * true to display the spinner
     *
     */
    @api displaySpinner;

    /**
     * rules for input parameters
     *
     */
    get inputRules() {
        return getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementType);
    }
}