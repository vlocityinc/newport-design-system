import { LightningElement, api, track } from 'lwc';
import { fetchOnce, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { LABELS } from "./invocableActionEditorLabels";
import { format } from "builder_platform_interaction/commonUtils";
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { mergeInputOutputParameters } from 'builder_platform_interaction/calloutEditorLib';

export default class InvocableActionEditor extends LightningElement {
    /**
     * Internal state for the editor
     */
    @track actionCallNode = {};

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
            this.fetchActionParameters();
        }
    }

    disconnectedCallback() {
        this.connected = false;
    }

    @api
    get node() {
        return this.actionCallNode;
    }

    set node(newValue) {
        this.actionCallNode = newValue || {};
        if (this.connected) {
            this.parameters = [];
            this.fetchActionParameters();
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
        return (this.actionCallNode && this.actionCallNode.elementType) ? this.actionCallNode.elementType : undefined;
    }

    fetchActionParameters() {
        const actionParams = { actionName: getValueFromHydratedItem(this.node.actionName), actionType: getValueFromHydratedItem(this.node.actionType) };
        const keyProvider = (params) => `${params.actionName}-${params.actionType}`;
        fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, actionParams, {keyProvider}).then((parameters) => {
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
    // used to keep track of whether this is an existing invocable action
    @api
    isNewMode = false;

    get subtitle() {
        return format(this.labels.actionCallSubTitle, getValueFromHydratedItem(this.actionCallNode.label));
    }

    get labelDescriptionConfig() {
        return {
            label: this.actionCallNode.label,
            description: this.actionCallNode.description,
            name: this.actionCallNode.name,
            guid: this.actionCallNode.guid,
        };
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */

    handlePropertyChanged(event) {
        event.stopPropagation();
        // TODO
    }

    /**
     * @param {object} event - property changed event coming from parameter-item component
     */
    handleUpdateParameterItem(event) {
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