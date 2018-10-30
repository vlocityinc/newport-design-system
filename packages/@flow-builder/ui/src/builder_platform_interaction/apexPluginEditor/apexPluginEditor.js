import { LightningElement, api, track } from 'lwc';
import { fetchOnce, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { LABELS } from "./apexPluginEditorLabels";
import { format } from "builder_platform_interaction/commonUtils";
import { getValueFromHydratedItem, getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { apexPluginReducer } from './apexPluginReducer';
import { MERGE_WITH_PARAMETERS, REMOVE_UNSET_PARAMETERS, getParameterListWarnings } from 'builder_platform_interaction/calloutEditorLib';
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { ClosePropertyEditorEvent, CannotRetrieveCalloutParametersEvent } from 'builder_platform_interaction/events';

export default class ApexPluginEditor extends LightningElement {
    /**
     * Internal state for the editor
     */
    @track apexPluginNode = {};

    @track displaySpinner = true;
    @track apexPluginDescriptor;

    labels = LABELS;
    connected = false;

    connectedCallback() {
        this.connected = true;
        if (this.node) {
            this.fetchApexPluginDescriptor();
            this.fetchApexPluginParameters();
        }
    }

    disconnectedCallback() {
        this.connected = false;
    }

    @api
    get node() {
        return this.apexPluginNode;
    }

    set node(newValue) {
        this.apexPluginNode = newValue || {};
        if (this.connected) {
            this.fetchApexPluginDescriptor();
            this.fetchApexPluginParameters();
        }
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        const event = new CustomEvent(REMOVE_UNSET_PARAMETERS);
        return apexPluginReducer(this.apexPluginNode, event);
    }

    /**
     * public api function to run the rules from apex plugin validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.apexPluginNode = apexPluginReducer(this.apexPluginNode, event);
        return getErrorsFromHydratedElement(this.apexPluginNode);
    }

    get elementType() {
        return (this.apexPluginNode && this.apexPluginNode.elementType) ? this.apexPluginNode.elementType : undefined;
    }

    // used to keep track of whether this is an existing apex plugin
    @api
    isNewMode = false;

    get subtitle() {
        if (!this.apexPluginNode) {
            return '';
        }
        const name = this.apexPluginDescriptor != null ? this.apexPluginDescriptor.name : getValueFromHydratedItem(this.apexPluginNode.apexClass);
        return format(this.labels.subtitle, name, this.labels.apexPluginTypeLabel);
    }

    get parameterListConfig() {
        return {
            inputTabHeader: this.labels.inputTabHeader,
            outputTabHeader: this.labels.outputTabHeader,
            emptyInputsMessage: this.labels.emptyInputs,
            emptyOutputsMessage: this.labels.emptyOutputs,
            sortInputs: true,
            sortOutputs: true,
            inputs: this.apexPluginNode.inputParameters,
            outputs: this.apexPluginNode.outputParameters,
            warnings: getParameterListWarnings(this.apexPluginNode.inputParameters, this.apexPluginNode.outputParameters, this.labels),
        };
    }

    fetchApexPluginDescriptor() {
        this.apexPluginDescriptor = undefined;
        const options = {disableErrorModal : true};
        fetchOnce(SERVER_ACTION_TYPE.GET_APEX_PLUGINS, {}, undefined, options).then((apexPlugins) => {
            if (this.connected) {
                this.apexPluginDescriptor = apexPlugins.find(apexPlugin => apexPlugin.apexClass === getValueFromHydratedItem(this.apexPluginNode.apexClass));
            }
        }).catch(() => {
            // ignore the error : we won't use the apexPluginDescriptor in this case
        });
    }

    fetchApexPluginParameters() {
        const apexParams = { apexClass: getValueFromHydratedItem(this.apexPluginNode.apexClass)};
        const keyProvider = (params) => `${params.apexClass}`;
        fetchOnce(SERVER_ACTION_TYPE.GET_APEX_PLUGIN_PARAMETERS, apexParams, keyProvider).then((parameters) => {
            if (this.connected) {
                this.displaySpinner = false;
                const event = new CustomEvent(MERGE_WITH_PARAMETERS, { detail : parameters });
                this.apexPluginNode = apexPluginReducer(this.apexPluginNode, event);
            }
        }).catch(() => {
            if (this.connected) {
                this.displaySpniner = false;
                this.cannotRetrieveParameters();
            }
        });
    }

    cannotRetrieveParameters() {
        if (!this.isNewMode) {
            const closePropertyEditorEvent = new ClosePropertyEditorEvent();
            this.dispatchEvent(closePropertyEditorEvent);
        } else {
            // let the parent property editor decide what to do
            const cannotRetrieveParametersEvent = new CannotRetrieveCalloutParametersEvent();
            this.dispatchEvent(cannotRetrieveParametersEvent);
        }
    }

    /**
     * @param {object} event - property changed event coming from label-description and parameter-item component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.apexPluginNode = apexPluginReducer(this.apexPluginNode, event);
    }
}