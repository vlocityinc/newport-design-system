import { LightningElement, api, track } from 'lwc';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { compareParamsByRequired, compareParamsByLabel } from './parameterUtils';
import { multiComparator } from 'builder_platform_interaction/sortLib';

export default class ParameterList extends LightningElement {
    @track state = {
        inputs: [],
        outputs: [],
    }

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
     * Message when there is no input. It should be replaced by emptyState component when it's ready W-5383760
     *
     */
    @api emptyInputsMessage;

    /**
     * Message when there is no output. It should be replaced by emptyState component when it's ready W-5383760
     *
     */
    @api emptyOutputsMessage;

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
     * rules for input parameters
     *
     */
    get inputRules() {
        return getRulesForElementType(RULE_TYPES.ASSIGNMENT, this.elementType);
    }

    get emptyInputs() {
        return this.state.inputs.length === 0;
    }

    get emptyOutputs() {
        return this.state.outputs.length === 0;
    }

    get sortedInputs() {
        return this.sortInputs ? this.state.inputs.slice().sort(multiComparator([compareParamsByRequired, compareParamsByLabel])) : this.state.inputs;
    }

    get sortedOutputs() {
        return this.sortOutputs ? this.state.outputs.slice().sort(compareParamsByLabel) : this.state.outputs;
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
}