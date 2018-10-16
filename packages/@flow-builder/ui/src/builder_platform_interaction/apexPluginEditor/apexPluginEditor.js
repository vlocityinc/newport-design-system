import { LightningElement, api, track } from 'lwc';
import { fetchOnce, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { LABELS } from "./apexPluginEditorLabels";
import { format } from "builder_platform_interaction/commonUtils";
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { mergeInputOutputParameters } from 'builder_platform_interaction/calloutEditorLib';

export default class ApexPluginEditor extends LightningElement {
    /**
     * Internal state for the editor
     */
    @track apexNode = {};

    @track inputs = [];
    @track outputs = [];

    @track displaySpinner = true;

    parameters = [];
    parametersFetched = false;
    labels = LABELS;
    connected = false;

    connectedCallback() {
        this.connected = true;
        if (this.node) {
            this.fetchApexPluginParameters();
        }
    }

    disconnectedCallback() {
        this.connected = false;
    }

    @api
    get node() {
        return this.apexNode;
    }

    set node(newValue) {
        this.apexNode = newValue || {};
        if (this.connected) {
            this.parameters = [];
            this.fetchApexPluginParameters();
        }
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.node;
    }

    /**
     * public api function to run the rules from actionCall validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        return [];
    }

    get elementType() {
        return (this.node && this.node.elementType) ? this.node.elementType : undefined;
    }

    // used to keep track of whether this is an existing invocable action
    @api
    isNewMode = false;

    get subtitle() {
        return format(this.labels.subtitle, getValueFromHydratedItem(this.apexNode.apexClass));
    }

    get parameterListConfig() {
        return {
            inputTabHeader: this.labels.inputTabHeader,
            outputTabHeader: this.labels.outputTabHeader,
            emptyInputsMessage: this.labels.emptyInputs,
            emptyOutputsMessage: this.labels.emptyOutputs,
            sortInputs: true,
            sortOutputs: true,
            inputs: this.inputs,
            outputs: this.outputs,
        };
    }

    fetchApexPluginParameters() {
        const apexParams = { apexClass: getValueFromHydratedItem(this.node.apexClass)};
        const keyProvider = (params) => `${params.apexClass}`;
        fetchOnce(SERVER_ACTION_TYPE.GET_APEX_PLUGIN_PARAMETERS, apexParams, keyProvider).then((parameters) => {
            if (this.connected) {
                this.parameters = parameters;
                this.parametersFetched = true;
                this.updateParameters();
            }
        }).catch(() => {
            if (this.connected) {
                this.parametersFetched = true;
                this.updateParameters();
            }
        });
    }

    /**
     * @param {object} event - property changed event coming from label-description and parameter-item component
     */
    handleEvent(event) {
        event.stopPropagation();
        // TODO
    }

    updateParameters() {
        if (this.parametersFetched) {
            const newParameters = mergeInputOutputParameters(this.parameters, this.node.inputParameters, this.node.outputParameters);
            this.inputs = newParameters.inputs;
            this.outputs = newParameters.outputs;
        }
        this.displaySpinner = false;
    }
}