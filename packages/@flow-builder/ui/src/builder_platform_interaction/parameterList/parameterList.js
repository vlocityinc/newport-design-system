import { LightningElement, api, track } from 'lwc';
import {
    getRulesForElementType,
    RULE_TYPES
} from 'builder_platform_interaction/ruleLib';
import {
    compareParamsByRequired,
    compareParamsByLabel
} from './parameterUtils';
import { multiComparator } from 'builder_platform_interaction/sortLib';

export default class ParameterList extends LightningElement {
    @track state = {
        inputs: [],
        outputs: []
    };

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
     * Title message when there is no input.
     *
     */
    @api emptyInputsTitle;

    /**
     * Body message when there is no input.
     *
     */
    @api emptyInputsBody;

    /**
     * Title when there is no output.
     *
     */
    @api emptyOutputsTitle;

    /**
     * Body when there is no output.
     *
     */
    @api emptyOutputsBody;

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
     *
     * @typedef {Object.<string, ParameterItemWarning>} ParameterListWarnings warnings for ParameterList component
     * The key is the rowIndex of the ParameterItem.
     */

    /**
     * @type {ParameterListWarnings} the warnings for the parameters
     */
    @api warnings = {};

    get sortedInputsWithWarnings() {
        const sortedInputs = this.sortInputs
            ? this.state.inputs
                  .slice()
                  .sort(
                      multiComparator([
                          compareParamsByRequired,
                          compareParamsByLabel
                      ])
                  )
            : this.state.inputs;
        return sortedInputs.map(item => ({
            item,
            warning: this.warnings[item.rowIndex] || {}
        }));
    }

    get sortedOutputsWithWarnings() {
        const sortedOutputs = this.sortOutputs
            ? this.state.outputs.slice().sort(compareParamsByLabel)
            : this.state.outputs;
        return sortedOutputs.map(item => ({
            item,
            warning: this.warnings[item.rowIndex] || {}
        }));
    }
}
