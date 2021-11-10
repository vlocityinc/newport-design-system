// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { LABELS } from './baseCalloutEditorLabels';
import { DynamicTypeMappingChangeEvent } from 'builder_platform_interaction/events';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { launchSubflow } from 'builder_platform_interaction/editor';
const { format } = commonUtils;

export default class BaseCalloutEditor extends LightningElement {
    @track
    state = {
        typeMappings: [],
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
    builderContext;

    @api
    editorParams;

    /**
     * List of dynamic type mappings for configuration editor
     */
    @api
    configurationEditorTypeMappings;

    @api
    displayOutputParams;

    labels = LABELS;

    /**
     * @typedef {Object} ParameterList
     * @property {string} inputTabHeader input tab header
     * @property {string} outputTabHeader  output tab header
     * @property {string} emptyInputsMessage  empty message if there are no input parameters. It should be replaced by emptyState component when  W-5383760 is ready.
     * @property {string} emptyOutputsMessage   empty message if there are no output parameters. It should be replaced by emptyState component when  W-5383760 is ready.
     * @property {boolean} [sortInputs]   true if input parameters need to be sorted
     * @property {boolean} [sortOutputs]  true if output parameters need to be sorted
     * @property {ParameterItem[]} inputs   input parameters
     * @property {ParameterItem[]} outputs output parameters
     * @property {ParameterListWarnings} warnings warnings for input or output parameters
     */

    /**
     * Config for data type mappings component.
     *
     */
    set typeMappings(newValue) {
        this.state.typeMappings = newValue || [];
    }

    @api
    get typeMappings() {
        return this.state.typeMappings;
    }

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
        return this.parameterListConfig.warnings ? this.parameterListConfig.warnings : {};
    }

    /**
     * Run in Mode of the element
     */
    @api
    runinmode;

    @api
    mode;

    @api
    hideParameters = false;

    @api
    hasConfigurationEditor = false;

    /**
     * Name of configuration editor associated with a component. It is null if it is not defined
     *
     * @memberof BaseCalloutEditor
     */
    @api
    configurationEditor;

    @api
    viewableSubflowInfo;

    get isSystemMode() {
        return this.runinmode
            ? this.runinmode.name === 'SystemModeWithSharing' || this.runinmode.name === 'SystemModeWithoutSharing'
            : false;
    }

    get learnMoreLink() {
        return this.runinmode ? this.runinmode.learnMoreLink : '';
    }

    get systemModeText() {
        return this.runinmode ? format(this.labels.runInMode, this.runinmode.value) : '';
    }

    get learnMoreText() {
        return this.labels.learnMore;
    }

    @api
    elementInfo;

    @api
    configurationEditorInputVariables;

    @api
    configurationEditorAllInputVariables;

    @api
    automaticOutputVariables;

    /**
     * Checks if transaction control picker can be displayed based on the process type
     */
    @api
    showTransactionControlPicker;

    @api
    validate() {
        if (this.configurationEditor) {
            const parameterList = this.template.querySelector('builder_platform_interaction-parameter-list');
            if (parameterList) {
                return parameterList.validate();
            }
        }
        return [];
    }

    get showTypeMappings() {
        return this.state.typeMappings && this.state.typeMappings.length > 0 && !this.hasConfigurationEditor;
    }

    handleOpenReferencedSubflow(event) {
        event.stopPropagation();
        launchSubflow(this.viewableSubflowInfo.activeVersionId || this.viewableSubflowInfo.latestVersionId);
    }

    handleDataTypeMappingChange(event) {
        const dataTypeMapping = this.state.typeMappings.find(({ rowIndex }) => rowIndex === event.target.rowIndex);
        this.dispatchEvent(
            new DynamicTypeMappingChangeEvent({
                typeName: getValueFromHydratedItem(dataTypeMapping.typeName),
                typeValue: event.detail.item ? getValueFromHydratedItem(event.detail.item.value) : '',
                rowIndex: event.target.rowIndex,
                error: event.detail.error
            })
        );
    }

    get emptyInputs() {
        return this.state.parameterListConfig.inputs?.length === 0;
    }

    renderedCallback() {
        // Updating the flow icon's background color since slds icon doesn't
        // have the background color used for the flow icon in Flow Builder.
        const referencedFlowCard = this.template.querySelector('lightning-card');
        if (referencedFlowCard) {
            const subflowIcon = referencedFlowCard.shadowRoot.querySelector('.slds-icon-standard-flow');
            if (subflowIcon) {
                subflowIcon.style.backgroundColor = '#54698d';
            }
        }
    }
}
