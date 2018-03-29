import { Element, api, track } from "engine";
import { getAllInvocableActionsForType, getApexPlugins } from 'builder_platform_interaction-actioncall-lib';
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
        actionComboMissingValueMessage : ''
    }
    invocableActions = [];
    invocableActionsLoaded = false;
    apexPlugins = [];
    apexPluginsLoaded = false;

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
        this.updateTypeCombo();
        this.updateActionCombo();
    }

    @api
    set selectedAction(newValue) {
        this.state.selectedElementType = newValue.elementType;
        if (this.state.selectedElementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            this.state.selectedActionValue = newValue.apexClass ? newValue.apexClass : '';
        } else {
            this.state.selectedActionValue = newValue.actionType && newValue.actionName ? newValue.actionType + '-' + newValue.actionName : '';
        }
    }

    @api
    get selectedAction() {
        let selectedAction;
        if (this.state.selectedElementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            const apexPluginFound = this.apexPlugins.find(apexPlugin => apexPlugin.name === this.state.selectedActionValue);
            if (apexPluginFound) {
                selectedAction = {
                    apexClass : apexPluginFound.name,
                    elementType : ELEMENT_TYPE.APEX_PLUGIN_CALL
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
        if (this.apexPluginsLoaded && this.invocableActionsLoaded) {
            this.updateTypeCombo();
            this.updateActionCombo();
            this.state.spinnerActive = false;
        }
    }

    updateActionCombo() {
        let items, label, missingValueMessage;
        switch (this.state.selectedElementType) {
            case ELEMENT_TYPE.ACTION_CALL:
                items = this.invocableActions.filter(action => action.IsStandard || action.Type === ACTION_TYPE.QUICK_ACTION).map(action => this.getComboItemFromInvocableAction(action));
                label = "Referenced Action";
                missingValueMessage = "Find an Action...";
                break;
            case ELEMENT_TYPE.APEX_CALL:
                items = this.invocableActions.filter(action => action.Type === ACTION_TYPE.APEX).map(action => this.getComboItemFromInvocableAction(action));
                label = "Referenced Apex";
                missingValueMessage = "Find an Apex Class...";
                break;
            case ELEMENT_TYPE.EMAIL_ALERT:
                items = this.invocableActions.filter(action => action.Type === ACTION_TYPE.EMAIL_ALERT).map(action => this.getComboItemFromInvocableAction(action));
                label = "Referenced Email Alert";
                missingValueMessage = "Find an Email Alert...";
                break;
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                items = this.apexPlugins.map(apexPlugin => this.getComboItemFromApexPlugin(apexPlugin));
                label = "Referenced Apex Plugin";
                missingValueMessage = "Find an Apex Plugin...";
                break;
            default:
                items = [];
        }
        this.state.actionComboLabel = label;
        this.state.actionComboMissingValueMessage = missingValueMessage;
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
        //        typeOptions.push({
        //          label : "Subflow",
        //             value : "subflow"
        //        });
        this.state.typeOptions = typeOptions;
    }

    handleElementTypeChanged(event) {
        event.stopPropagation();
        this.state.selectedElementType = event.detail.value;
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