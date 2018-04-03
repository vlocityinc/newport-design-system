import { Element, api, track, unwrap } from 'engine';
import { actionCallReducer } from './actioncall-reducer';
import inputs from '@label/DesignerLabels.actioncall_inputs_label';
import outputs from '@label/DesignerLabels.actioncall_outputs_label';
import { createAction } from 'builder_platform_interaction-actions';
import { replaceItem } from 'builder_platform_interaction-data-mutation-lib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-constant';
import { getInvocableActionParameters } from 'builder_platform_interaction-actioncall-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

/**
 * @constant UPDATE_PROPERTY
 * @type {string}
 */
const UPDATE_PROPERTY = 'UPDATE_PROPERTY';

const ACTIVETABID_DEFAULT = "tabitem-inputs";

export default class ActionCallEditor extends Element {
    /**
     * Internal state for the editor
     */
    @track actionCallNode = {};
    @track activetabid = ACTIVETABID_DEFAULT;

    @track inputs = [];
    @track outputs = [];

    labels = {
        inputs,
        outputs
    };

    static UPDATE_PROPERTY = UPDATE_PROPERTY;

    @api
    get node() {
        return this.actionCallNode;
    }

    @api
    set node(newValue) {
        this.actionCallNode = newValue || {};
        // init inputs, outputs
        if (this.elementType !== ELEMENT_TYPE.SUBFLOW && this.elementType !== ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            getInvocableActionParameters(this.node.actionName.value, this.node.actionType.value, actionParameters => this.updateInputOutputParameters(actionParameters));
        }
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.node);
    }

    /**
     * public api function to run the rules from actionCall validation library
     * @returns {object} list of errors
     */
    @api validate() {
        return [];
    }

    /**
     * @returns {object} label, eg : {value: "xyz", error: null}
     */
    get label() {
        return (this.node && this.node.label) ? this.node.label : undefined;
    }

    /**
     * @returns {object} description
     */
    get description() {
        return (this.node && this.node.description) ? this.node.description : undefined;
    }

    /**
     * @returns {object} devName
     */
    get devName() {
        return (this.node && this.node.name) ? this.node.name : undefined;
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
        const propertyName = event.propertyName;
        const value = event.value;
        const error = event.error;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error});
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
        const selectedAction = event.detail.value;
        if (selectedAction.elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            // TODO : create an action instead and use reducer
            delete this.node.actionName;
            delete this.node.actionType;
            this.node.elementType = selectedAction.elementType;
            this.node.apexClass = {
                value : selectedAction.apexClass
            };
            // TODO : update input/output parameters
        } else {
            // TODO : create an action instead and use reducer
            delete this.node.apexClass;
            this.node.elementType = selectedAction.elementType;
            this.node.actionType = {
                value : selectedAction.actionType
            };
            this.node.actionName = {
                value : selectedAction.actionName
            };
            getInvocableActionParameters(selectedAction.actionName, selectedAction.actionType, actionParameters => this.updateInputOutputParameters(actionParameters));
        }
    }

    updateInputOutputParameters(parameters) {
        let inputParams, outputParams;
        if (this.elementType !== ELEMENT_TYPE.SUBFLOW) {
            inputParams = parameters.filter(parameter => parameter.IsInput === true);
            outputParams = parameters.filter(parameter => parameter.IsOutput === true);
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
     * @param {object} parameterInfos - input/output parameters (without values)
     *      each paramInfo looks like {Name, Label, DataType...} (see parameter-item)
     * @param {object} nodeParameters - action call input/output parameters
     *      each nodeParam looks like {name: {value, error}, value: {stringValue: {value, error}}, processMetadataValues} - input parameter
     *      each nodeParam looks like {name: {value, error}, assignToReference: {value, error}, processMetadataValues} - output parameter
     * @param {String} mergedKey - 'value' for input parameter, 'assignToReference' for output parameter
     * @return {object} an input/output parameter array with values
     *      each final input param looks like {Name, Label, DataType, ..., value: {stringValue: {value, error}}
     *      each final output param looks like {Name, Label, DataType, ..., assignToReference: {value, error}
     */
    mergeParameters(parameterInfos, nodeParameters, mergedKey) {
        const finalArray = [];
        parameterInfos.forEach(paramInfo => {
            // find paramInfo that has the same name as nodeParam
            const paramFound = nodeParameters.find(nodeParam => nodeParam.name.value === paramInfo.Name);
            const obj = (paramFound) ? {[mergedKey]: paramFound[mergedKey]} : {};
            finalArray.push(Object.assign({}, paramInfo, obj));
        });
        return finalArray;
    }

    /**
     * @param {object} event - update parameter item event coming from parameter-item component
     */
    handleUpdateParameterItem(event) {
        event.stopPropagation();
        if (!event.detail.error) {
            // TODO: should use reducer to update node
            if (event.detail.isInput) {
                this.inputs = replaceItem(this.inputs, event.detail.item, event.detail.index);
            } else {
                this.outputs = replaceItem(this.outputs, event.detail.item, event.detail.index);
            }
        }
        // TODO: show or hide error icon on tab
    }
}