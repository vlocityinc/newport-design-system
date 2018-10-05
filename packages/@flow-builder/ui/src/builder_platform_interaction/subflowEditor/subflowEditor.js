import { LightningElement, api, track } from 'lwc';
import { LABELS } from "./subflowEditorLabels";
import { fetchOnce, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { mergeSubflowAssignmentsWithInputOutputVariables } from 'builder_platform_interaction/calloutEditorLib';
import { getValueFromHydratedItem, getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { format } from 'builder_platform_interaction/commonUtils';
import { createAction, PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";
import { subflowReducer } from "./subflowReducer";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { FLOW_PROCESS_TYPE } from "builder_platform_interaction/flowMetadata";

export default class SubflowEditor extends LightningElement {
    @track subflowNode = {};

    @track inputs = [];
    @track outputs = [];

    @track displaySpinner = true;

    @track subflowDescriptor;

    labels = LABELS;
    connected = false

    // true if we are creating a new subflow element, false if editing an existing subflow element
    @api
    isNewMode = false;

    @api
    flowProcessType = FLOW_PROCESS_TYPE.FLOW;

    connectedCallback() {
        this.connected = true;
        if (this.node) {
            this.fetchSubflowDescriptor();
            this.fetchFlowInputOutputVariables();
        }
    }

    disconnectedCallback() {
        this.connected = false;
    }

    fetchFlowInputOutputVariables() {
        this.displaySpinner = true;
        this.inputs = [];
        this.outputs = [];
        const flowName = getValueFromHydratedItem(this.node.flowName);
        fetchOnce(SERVER_ACTION_TYPE.GET_FLOW_INPUT_OUTPUT_VARIABLES, {
            flowName
        }).then((inputOutputVariables) => {
            if (this.connected) {
                this.displaySpinner = false;
                const newParameters = mergeSubflowAssignmentsWithInputOutputVariables(this.node.inputAssignments, this.node.outputAssignments, inputOutputVariables);
                this.inputs = newParameters.inputs;
                this.outputs = newParameters.outputs;
            }
        }).catch(() => {
            if (this.connected) {
                this.displaySpinner = false;
            }
        });
    }

    fetchSubflowDescriptor() {
        this.subflowDescriptor = undefined;
        const flowName = getValueFromHydratedItem(this.node.flowName);
        fetchOnce(SERVER_ACTION_TYPE.GET_SUBFLOWS, {
            flowProcessType : this.flowProcessType
        }).then((subflows) => {
            if (this.connected) {
                this.subflowDescriptor = subflows.find(f => f.fullName === flowName);
            }
        });
    }

    @api
    get node() {
        return this.subflowNode;
    }

    set node(newValue) {
        this.subflowNode = newValue || {};
        if (this.connected) {
            this.fetchSubflowDescriptor();
            this.fetchFlowInputOutputVariables();
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
        const action = createAction(VALIDATE_ALL);
        this.subflowNode = subflowReducer(this.subflowNode, action);
        return getErrorsFromHydratedElement(this.subflowNode);
    }

    get elementType() {
        return (this.node && this.node.elementType) ? this.node.elementType : undefined;
    }

    get subtitle() {
        if (this.subflowDescriptor == null) {
            return '';
        }
        return format(this.labels.subtitle, getValueFromHydratedItem(this.subflowDescriptor.masterLabel));
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        event.stopPropagation();
        const { propertyName, value, error } = event.detail;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.subflowNode = subflowReducer(this.subflowNode, action);
    }
}