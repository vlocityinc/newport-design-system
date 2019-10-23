import { LightningElement, api, track } from 'lwc';
import { LABELS } from './baseCalloutEditorLabels';
import { format } from 'builder_platform_interaction/commonUtils';

export default class BaseCalloutEditor extends LightningElement {
    @track
    state = {
        parameterListConfig: {}
    };
    /**
     * Config for label-description component. For example {name: actionNode.name, label: actionNode.label, description: actionNode.label, guid: actionNode.guid}
     *
     */
    @api
    labelDescriptionConfig;

    /**
     * Modal subtitle
     *
     */
    @api
    subtitle;

    @api
    flowContext;

    labels = LABELS;

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

    /**
     * Name of configuration editor associated with a component. It is null if it is not defined
     *
     * @memberof BaseCalloutEditor
     */
    @api
    configurationEditor;

    get isSystemMode() {
        return this.runinmode
            ? this.runinmode.name === 'SystemModeWithSharing'
            : false;
    }

    get learnMoreLink() {
        return this.runinmode ? this.runinmode.learnMoreLink : '';
    }

    get systemModeText() {
        return this.runinmode
            ? format(this.labels.runInMode, this.runinmode.value)
            : '';
    }

    get learnMoreText() {
        return this.labels.learnMore;
    }

    /**
     * Custom Property Editor Attributes
     */
    @api
    configurationEditorProperties;
}
