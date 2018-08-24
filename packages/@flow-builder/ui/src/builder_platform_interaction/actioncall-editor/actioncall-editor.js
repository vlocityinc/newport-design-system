import { LightningElement, api, track } from 'lwc';
import { actionCallReducer } from './actioncall-reducer';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';
import { LABELS } from './actioncall-editor-labels';

const ACTIVETABID_DEFAULT = "tabitem-inputs";

export default class ActionCallEditor extends LightningElement {
    /**
     * Internal state for the editor
     */
    @track actionCallNode = {};
    @track activetabid = ACTIVETABID_DEFAULT;

    @track inputs = [];
    @track outputs = [];

    labels = LABELS;

    stopCallbackExecutionGetParameters = null;

    disconnectedCallback() {
        if (this.stopCallbackExecutionGetParameters) {
            this.stopCallbackExecutionGetParameters();
        }
    }

    @api
    get node() {
        return this.actionCallNode;
    }

    set node(newValue) {
        this.actionCallNode = newValue || {};
        // init inputs, outputs
        this.fetchAndUpdateParameters();
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

    get selectedAction() {
        if (this.node.elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            return {
                elementType :  this.node.elementType,
                apexClass : this.node.apexClass.value
            };
        } else if (this.node.elementType === ELEMENT_TYPE.SUBFLOW) {
            return {
                elementType :  this.node.elementType,
                flowName : this.node.flowName.value
            };
        }
        return {
            elementType :  this.node.elementType,
            actionType : this.node.actionType.value,
            actionName : this.node.actionName.value,
        };
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        event.stopPropagation();
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { ...event.detail });
        this.actionCallNode = actionCallReducer(this.node, action);
    }

    @api
    get activeTabId() {
        return this.activetabid;
    }

    handleTabChanged(event) {
        this.activetabid = event.detail.tabId;
    }

    handleActionSelected(event) {
        const value = event.detail.value;
        const action = createAction(PROPERTY_EDITOR_ACTION.CHANGE_ACTION_TYPE, value);
        this.actionCallNode = actionCallReducer(this.actionCallNode, action);
        this.fetchAndUpdateParameters();
    }

    fetchAndUpdateParameters() {
        switch (this.elementType) {
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                // TODO : fetch apex plugin parameters
                break;
            case ELEMENT_TYPE.SUBFLOW:
                // TODO : fetch subflow parameters
                break;
            default:
                if (this.stopCallbackExecutionGetParameters) {
                    this.stopCallbackExecutionGetParameters();
                }
                // TODO we shouldn't fetch data if node.actionName isn't set
                this.stopCallbackExecutionGetParameters = fetch(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTION_PARAMETERS, ({data}) => {
                    // TODO handle error
                    this.stopCallbackExecutionGetParameters = null;
                    if (data) {
                        this.updateInputOutputParameters(data);
                    }
                }, {
                    actionName: this.node.actionName.value,
                    actionType: this.node.actionType.value
                });
        }
    }

    updateInputOutputParameters(parameters) {
        let inputParams, outputParams;
        switch (this.elementType) {
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                inputParams = parameters.filter(parameter => parameter.IsInput === true);
                outputParams = parameters.filter(parameter => parameter.IsOutput === true);
                break;
            case ELEMENT_TYPE.SUBFLOW:
                // TODO: filter for subFlow
                break;
            default:
                inputParams = parameters.filter(parameter => parameter.isInput === true);
                outputParams = parameters.filter(parameter => parameter.isOutput === true);
        }
        // merge with actionCallNode to get value
        if (this.node.inputParameters) {
            inputParams = this.mergeParameters(inputParams, this.node.inputParameters, 'value');
        }
        if (this.node.outputParameters) {
            outputParams = this.mergeParameters(outputParams, this.node.outputParameters, 'assignToReference');
        }
        // if there are any input parameters, assign to inputs
        if (inputParams) {
            this.inputs = inputParams;
        }
        // if there are any output parameters, assign to outputs
        if (outputParams) {
            this.outputs = outputParams;
        }
    }

    /**
     * @typedef {Object} ValueErrorObject
     * @property {String} value the value of the object
     * @property {String} error the error
     */

    /**
     * @typedef {Object} NodeParameter
     * @property {ValueErrorObject} name of the parameter
     * @property {InputParameterValue} value of the input parameter
     * @property {ValueErrorObject} assignToReference of the output parameter
     * @property {object} processMetadataValues
     */

    /**
     * @param {object} parameterInfos - array of ParameterItem (without values)
     * @param {object} nodeParameters - array of NodeParameter
     * @param {String} mergedKey - 'value' for input parameter, 'assignToReference' for output parameter
     * @return {object} an array of ParameterItem with values
     */
    mergeParameters(parameterInfos, nodeParameters, mergedKey) {
        const finalArray = [];
        parameterInfos.forEach(paramInfo => {
            // find paramInfo that has the same name as nodeParam
            const nodeParamsFound = nodeParameters.filter(nodeParam => nodeParam.name.value === paramInfo.Name);
            if (nodeParamsFound.length > 0) {
                nodeParamsFound.forEach(nodeParamFound => {
                    finalArray.push(Object.assign({}, paramInfo, {[mergedKey]: nodeParamFound[mergedKey]}));
                });
            } else {
                finalArray.push(Object.assign({}, paramInfo, {}));
            }
        });
        return finalArray;
    }

    /**
     * @param {object} event - update parameter item event coming from parameter-item component
     */
    handleUpdateParameterItem(event) {
        event.stopPropagation();
        if (!event.detail.error) {
            const value = event.detail.value;
            // TODO: should use reducer to update node
            if (event.detail.isInput) {
                this.updateParameter(this.inputs[event.detail.index], 'value', value);
            } else {
                this.updateParameter(this.outputs[event.detail.index], 'assignToReference', value);
            }
        }
        // TODO: show or hide error icon on tab
    }

    /**
     * @param {ParameterItem} param - the parameter item
     * @param {String} property - the property need to be updated
     * @param {object} value - the updated value
     */
    updateParameter(param, property, value) {
        if (!value) {
            delete param[property];
        } else {
            param[property] = value;
        }
    }
}