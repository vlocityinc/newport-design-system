import { LightningElement, api, track } from 'lwc';

export default class BaseCalloutEditor extends LightningElement {
    @track state = {
        parameterListConfig: {}
    };
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
     * @typedef {Object} ParameterList
     * @property {String} inputTabHeader input tab header
     * @property {String} outputTabHeader  output tab header
     * @property {String} emptyInputsMessage  empty message if there are no input parameters. It should be replaced by emptyState component when  W-5383760 is ready.
     * @property {String} emptyOutputsMessage   empty message if there are no output parameters. It should be replaced by emptyState component when  W-5383760 is ready.
     * @property {boolean} [sortInputs]   true if input parameters need to be sorted
     * @property {boolean} [sortOutputs]  true if output parameters need to be sorted
     * @property {ParameterItem[]} inputs   input parameters
     * @property {ParameterItem[]} outputs output parameters
     * @property {ParameterListWarnings} warnings warnings for input or output parameters
     */

    /**
     * Config for parameter list component.
     *
     */
    set parameterListConfig(newValue) {
        this.state.parameterListConfig = newValue || {};
    }

    @api
    get parameterListConfig() {
        return this.state.parameterListConfig;
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

    get warnings() {
        return this.parameterListConfig.warnings
            ? this.parameterListConfig.warnings
            : {};
    }

    /**
     * Run in Mode of the element
     */
    @api
    runinmode;
}
