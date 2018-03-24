import { Element, api, track } from "engine";
import { getAllInvocableActionsForType, getApexPlugins } from 'builder_platform_interaction-actioncall-lib';
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

/**
 * @constant APEXPLUGIN_ACTION_TYPE
 * @type {string}
 */
const APEXPLUGIN_ACTION_TYPE = 'apexPlugin';


export default class ActionSelector extends Element {
    @track invocableActions = [];
    @track
    state = {
        selectedType : ELEMENT_TYPE.ACTION_CALL,
        actionMenuData : [
            {
                items : []
            }
        ]
    }
    invocableActions = [];
    apexPlugins = [];

    constructor() {
        super();
        getAllInvocableActionsForType(invocableActions => this.setActions(invocableActions, this.apexPlugins));
        getApexPlugins(apexPlugins => this.setActions(this.invocableActions, apexPlugins));
    }

    @api
    set selectedType(newValue) {
        this.state.selectedType = newValue || ELEMENT_TYPE.ACTION_CALL;
    }

    @api
    get selectedType() {
        return this.state.selectedType;
    }

    setActions(invocableActions, apexPlugins) {
        this.invocableActions = invocableActions;
        this.apexPlugins = apexPlugins;
        this.updateActionMenuData();
    }

    updateActionMenuData() {
        let items;
        switch (this.state.selectedType) {
            case ELEMENT_TYPE.ACTION_CALL:
                items = this.invocableActions.filter(action => action.IsStandard || action.Type === "quickAction").map(action => this.getComboItemFromInvocableAction(action));
                break;
            case "apex":
                items = this.invocableActions.filter(action => action.Type === "apex").map(action => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                items = this.apexPlugins.map(apexPlugin => this.getComboItemFromApexPlugin(apexPlugin));
                break;
            default:
                items = [];
        }
        this.state.actionMenuData = [{ items }];
    }

    handleTypeChanged(event) {
        event.stopPropagation();
        this.state.selectedType = event.detail.value;
        this.updateActionMenuData();
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
            value: APEXPLUGIN_ACTION_TYPE + "-" + apexPlugin.name,
            subText : apexPlugin.Description || ""
        };
    }

    get typesItems() {
        return [
            {
                label : "Action",
                value : ELEMENT_TYPE.ACTION_CALL,
            },
            {
                label : "Apex",
                value : "apex",
            },
            {
                label : "Custom",
                value : ELEMENT_TYPE.APEX_PLUGIN_CALL,
            },
            {
                label : "Email Alert",
                value : "emailAlert",
            },
            {
                label : "Subflow",
                value : "subflow",
            }
        ];
    }

    getActionTypeAndName(actionItemValue) {
        let actionTypeAndName;
        const actionFound = this.invocableActions.find(action => action.DurableId === actionItemValue);
        if (actionFound) {
            actionTypeAndName = {
                actionName : actionFound.Name,
                actionType : actionFound.Type
            };
        }
        const apexPluginFound = this.apexPlugins.find(apexPlugin => APEXPLUGIN_ACTION_TYPE + "-" + apexPlugin.name === actionItemValue);
        if (apexPluginFound) {
            actionTypeAndName = {
                actionName : apexPluginFound.name,
                actionType : APEXPLUGIN_ACTION_TYPE
            };
        }
        return actionTypeAndName;
    }

    handleActionChanged(event) {
        event.stopPropagation();
        let actionItemValue = event.value;
        // TODO : combox value is currently wrapped into {! }
        if (actionItemValue.startsWith('{!') && actionItemValue.endsWith('}')) {
            actionItemValue = actionItemValue.substring(2, actionItemValue.length - 1);
        }
        const actionTypeAndName = this.getActionTypeAndName(actionItemValue);
        if (actionTypeAndName) {
            const valueChangedEvent = new ValueChangedEvent(actionTypeAndName);
            this.dispatchEvent(valueChangedEvent);
        }
    }

    handleFetchMenuData(event) {
        event.stopPropagation();
        // just to remove the activity indicator
        // TODO : should not be necessary
        this.state.actionMenuData = [{ items : this.state.actionMenuData[0].items }];
    }
}