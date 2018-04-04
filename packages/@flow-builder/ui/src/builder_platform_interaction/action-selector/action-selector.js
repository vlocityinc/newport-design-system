import { Element, api, track } from "engine";
import { getAllInvocableActionsForType, getApexPlugins, getSubflows } from 'builder_platform_interaction-actioncall-lib';
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { ACTION_TYPE } from 'builder_platform_interaction-flow-metadata';

export default class ActionSelector extends Element {
    @track
    state = {
        selectedElementType : ELEMENT_TYPE.ACTION_CALL,
        selectedActionValue : '',
        actionMenuData : [
            {
                items : []
            }
        ],
        spinnerActive : true,
        actionComboLabel : '',
        actionPlaceholder : ''
    };
    invocableActions = [];
    invocableActionsLoaded = false;
    apexPlugins = [];
    apexPluginsLoaded = false;
    subflows = [];
    subflowsLoaded = false;

    constructor() {
        super();
        getAllInvocableActionsForType(invocableActions => {
            this.invocableActions = invocableActions;
            this.invocableActionsLoaded = true;
            this.updateComboboxes();
        });
        getApexPlugins(apexPlugins => {
            this.apexPlugins = apexPlugins;
            this.apexPluginsLoaded = true;
            this.updateComboboxes();
        });
        getSubflows(subflows => {
            this.subflows = subflows;
            this.subflowsLoaded = true;
            this.updateComboboxes();
        });
        this.updateTypeCombo();
        this.updateActionCombo();
    }

    /**
     * @typedef {Object} SelectedAction
     * @property {string} elementType the element type (one of the action ELEMENT_TYPE)
     * @property {string} [apexClass] the apex class (when elementType is ELEMENT_TYPE.APEX_PLUGIN_CALL)
     * @property {string} [flowName] the flow name (when elementType is ELEMENT_TYPE.SUBFLOW)
     * @property {string} [actionType] the action name (for invocable actions)
     * @property {string} [actionName] the action name (for invocable actions)
     */

    /**
     * Set the selected action
     *
     * @param {SelectedAction} newValue the selected action
     */
    @api
    set selectedAction(newValue) {
        this.state.selectedElementType = newValue.elementType ? newValue.elementType : ELEMENT_TYPE.ACTION_CALL;
        if (this.state.selectedElementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            this.state.selectedActionValue = newValue.apexClass ? newValue.apexClass : '';
        } else if (this.state.selectedElementType === ELEMENT_TYPE.SUBFLOW) {
            this.state.selectedActionValue = newValue.flowName ? newValue.flowName : '';
        } else {
            this.state.selectedActionValue = newValue.actionType && newValue.actionName ? newValue.actionType + '-' + newValue.actionName : '';
        }
    }

    /**
     * Get the selected action
     *
     * @return {SelectedAction} The selected action
     */
    @api
    get selectedAction() {
        let selectedAction;
        if (this.state.selectedElementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            const apexPluginFound = this.apexPlugins.find(apexPlugin => apexPlugin.name === this.state.selectedActionValue);
            if (apexPluginFound) {
                selectedAction = {
                    apexClass : apexPluginFound.name,
                    elementType : this.state.selectedElementType
                };
            }
        } else if (this.state.selectedElementType === ELEMENT_TYPE.SUBFLOW) {
            const subflowFound = this.subflows.find(subflow => subflow.developerName === this.state.selectedActionValue);
            if (subflowFound) {
                selectedAction = {
                    flowName : subflowFound.developerName,
                    elementType : this.state.selectedElementType
                };
            }
        } else {
            const actionFound = this.invocableActions.find(action => action.DurableId === this.state.selectedActionValue);
            if (actionFound) {
                selectedAction = {
                    actionName : actionFound.Name,
                    actionType : actionFound.Type,
                    elementType : this.state.selectedElementType
                };
            }
        }
        return selectedAction;
    }

    updateComboboxes() {
        if (this.apexPluginsLoaded && this.invocableActionsLoaded && this.subflowsLoaded) {
            this.updateTypeCombo();
            this.updateActionCombo();
            this.state.spinnerActive = false;
        }
    }

    updateActionCombo() {
        let items, label, placeholder;
        switch (this.state.selectedElementType) {
            case ELEMENT_TYPE.ACTION_CALL:
                items = this.invocableActions.filter(action => action.IsStandard || action.Type === ACTION_TYPE.QUICK_ACTION).map(action => this.getComboItemFromInvocableAction(action));
                label = "Referenced Action";
                placeholder = "Find an Action...";
                break;
            case ELEMENT_TYPE.APEX_CALL:
                items = this.invocableActions.filter(action => action.Type === ACTION_TYPE.APEX).map(action => this.getComboItemFromInvocableAction(action));
                label = "Referenced Apex";
                placeholder = "Find an Apex Class...";
                break;
            case ELEMENT_TYPE.EMAIL_ALERT:
                items = this.invocableActions.filter(action => action.Type === ACTION_TYPE.EMAIL_ALERT).map(action => this.getComboItemFromInvocableAction(action));
                label = "Referenced Email Alert";
                placeholder = "Find an Email Alert...";
                break;
            case ELEMENT_TYPE.LOCAL_ACTION_CALL:
                items = this.invocableActions.filter(action => action.Type === ACTION_TYPE.COMPONENT).map(action => this.getComboItemFromInvocableAction(action));
                label = "Referenced Local Action";
                placeholder = "Find a Local Action...";
                break;
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                items = this.apexPlugins.map(apexPlugin => this.getComboItemFromApexPlugin(apexPlugin));
                label = "Referenced Apex Plugin";
                placeholder = "Find an Apex Plugin...";
                break;
            case ELEMENT_TYPE.SUBFLOW:
                items = this.subflows.map(subflow => this.getComboItemFromSubflow(subflow));
                label = "Referenced Subflow";
                placeholder = "Find Subflow...";
                break;
            default:
                items = [];
        }
        this.state.actionComboLabel = label;
        this.state.actionPlaceholder = placeholder;
        this.state.actionMenuData = [{ items }];
    }

    updateTypeCombo() {
        const typeOptions = [{
            label : "Action",
            value : ELEMENT_TYPE.ACTION_CALL
        }];
        if (this.invocableActions.find(action => action.Type === ACTION_TYPE.APEX)) {
            typeOptions.push({
                label : "Apex",
                value : ELEMENT_TYPE.APEX_CALL
            });
        }
        if (this.apexPlugins.length > 0) {
            typeOptions.push({
                label : "Apex Plugin",
                value : ELEMENT_TYPE.APEX_PLUGIN_CALL
            });
        }
        if (this.invocableActions.find(action => action.Type === ACTION_TYPE.EMAIL_ALERT)) {
            typeOptions.push({
                label : "Email Alert",
                value : ELEMENT_TYPE.EMAIL_ALERT
            });
        }
        if (this.invocableActions.find(action => action.Type === ACTION_TYPE.COMPONENT)) {
            typeOptions.push({
                label : "Local Action",
                value : ELEMENT_TYPE.LOCAL_ACTION_CALL
            });
        }
        if (this.subflows.length > 0) {
            typeOptions.push({
                label : "Subflow",
                value : ELEMENT_TYPE.SUBFLOW
            });
        }
        this.state.typeOptions = typeOptions;
    }

    handleElementTypeChanged(event) {
        event.stopPropagation();
        this.state.selectedElementType = event.detail.value;
        this.state.selectedActionValue = '';
        this.updateActionCombo();
    }

    getComboItemFromInvocableAction(action) {
        return {
            type : "option-card",
            text : action.Label,
            value: action.DurableId,
            subText : action.Description || ""
        };
    }

    getComboItemFromApexPlugin(apexPlugin) {
        return {
            type : "option-card",
            text : apexPlugin.name,
            value: apexPlugin.name,
            subText : apexPlugin.Description || ""
        };
    }

    getComboItemFromSubflow(subflow) {
        return {
            type : "option-card",
            text : subflow.masterLabel,
            value: subflow.developerName,
            subText : subflow.description || ""
        };
    }

    handleActionChanged(event) {
        event.stopPropagation();
        this.state.selectedActionValue = event.detail.value;
        // TODO : combox value is currently wrapped into {! }
        if (this.state.selectedActionValue.startsWith('{!') && this.state.selectedActionValue.endsWith('}')) {
            this.state.selectedActionValue = this.state.selectedActionValue.substring(2, this.state.selectedActionValue.length - 1);
        }
        const selectedAction = this.selectedAction;
        if (selectedAction) {
            const valueChangedEvent = new ValueChangedEvent(selectedAction);
            this.dispatchEvent(valueChangedEvent);
        }
    }
}