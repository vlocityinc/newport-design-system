import { Element, api, track } from "engine";
import { ValueChangedEvent } from 'builder_platform_interaction-events';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { ACTION_TYPE, FLOW_PROCESS_TYPE } from 'builder_platform_interaction-flow-metadata';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';
import { LABELS } from './action-selector-labels';

const SELECTORS = {
    TYPES: '.types',
};

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
        actionPlaceholder : '',
        errorMessage : ''
    };
    @api
    flowProcessType = FLOW_PROCESS_TYPE.FLOW;

    invocableActions = [];
    invocableActionsLoaded = false;
    stopCallbackExecutionInvocableActions = null;
    apexPlugins = [];
    apexPluginsLoaded = false;
    stopCallbackExecutionApexPlugins = null;
    subflows = [];
    subflowsLoaded = false;
    stopCallbackExecutionSubflows = null;

    connectedCallback() {
        this.stopCallbackExecutionApexPlugins = fetch(SERVER_ACTION_TYPE.GET_APEX_PLUGINS, this.getApexPluginsCallback);
        this.stopCallbackExecutionSubflows = fetch(SERVER_ACTION_TYPE.GET_SUBFLOWS, this.getSubflowsCallback, {
            flowProcessType : this.flowProcessType
        });
        this.stopCallbackExecutionInvocableActions = fetch(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, this.getInvocableActionsCallback, {
            flowProcessType : this.flowProcessType
        });
        this.updateTypeCombo();
        this.updateActionCombo();
    }

    renderedCallback() {
        if (this.state.errorMessage) {
            const typeCombo = this.template.querySelector(SELECTORS.TYPES);
            typeCombo.setCustomValidity(this.state.errorMessage);
            typeCombo.showHelpMessageIfInvalid();
        }
    }

    disconnectedCallback() {
        if (!this.apexPluginsLoaded) {
            this.stopCallbackExecutionApexPlugins();
        }
        if (!this.subflowsLoaded) {
            this.stopCallbackExecutionSubflows();
        }
        if (!this.apexPluginsLoaded) {
            this.stopCallbackExecutionInvocableActions();
        }
    }

    /**
     * @typedef {Object} InvocableAction
     *
     * @property {boolean} isStandard
     * @property {String} type "apex", "quickAction", "component" or same as name for standard invocable actions
     * @property {String} description
     * @property {String} label
     * @property {String} durableId type-name, for ex "apex-LogACall", "deactivateSessionPermSet-deactivateSessionPermSet"
     * @property {String} name for ex "LogACall", "chatterPost", "CollaborationGroup.NewGroupMember" ...
     */

    /**
     * Callback which gets executed after getting invocable actions
     *
     * @param {Object} response the response
     * @param {Object} [response.error] if there is error fetching the data
     * @param {InvocableAction[]} [response.data] The invocable actions
     */
    getInvocableActionsCallback = ({data, error}) => {
        if (error) {
            this.state.errorMessage = LABELS.CANNOT_GET_INVOCABLE_ACTIONS;
        } else {
            this.invocableActions = data;
        }
        this.invocableActionsLoaded = true;
        this.stopCallbackExecutionInvocableActions = null;
        this.updateComboboxes();
    };

    /**
     * @typedef {Object} ApexPlugin
     *
     * @property {String} apexClass
     * @property {String} description
     * @property {String} name
     * @property {String} tag
     */

    /**
     * Callback which gets executed after getting apex plugins
     *
     * @param {Object} response the response
     * @param {Object} [response.error] if there is error fetching the data
     * @param {ApexPlugin[]} [response.data] The apex plugins
     */
    getApexPluginsCallback = ({data, error}) => {
        if (error) {
            this.state.errorMessage = LABELS.CANNOT_GET_APEX_PLUGINS;
        } else {
            this.apexPlugins = data;
        }
        this.apexPluginsLoaded = true;
        this.stopCallbackExecutionApexPlugins = null;
        this.updateComboboxes();
    };

    /**
     * @typedef {Object} Subflow
     *
     * @property {String} masterLabel
     * @property {String} description
     * @property {String} developerName
     * @property {String} namespacePrefix
     */

    /**
     * Callback which gets executed after getting subflows
     *
     * @param {Object} response the response
     * @param {Object} [response.error] if there is error fetching the data
     * @param {Subflow[]} [response.data] The subflows
     */
    getSubflowsCallback = ({data, error}) => {
        if (error) {
            this.state.errorMessage = LABELS.CANNOT_GET_SUBFLOWS;
        } else {
            this.subflows = data;
        }
        this.subflowsLoaded = true;
        this.stopCallbackExecutionSubflows = null;
        this.updateComboboxes();
    };

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
            const actionFound = this.invocableActions.find(action => action.durableId === this.state.selectedActionValue);
            if (actionFound) {
                selectedAction = {
                    actionName : actionFound.name,
                    actionType : actionFound.type,
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
        let items;
        const selectedElementType = this.state.selectedElementType;
        switch (selectedElementType) {
            case ELEMENT_TYPE.ACTION_CALL:
                items = this.invocableActions.filter(action => action.isStandard || action.type === ACTION_TYPE.QUICK_ACTION).map(action => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.APEX_CALL:
                items = this.invocableActions.filter(action => action.type === ACTION_TYPE.APEX).map(action => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.EMAIL_ALERT:
                items = this.invocableActions.filter(action => action.type === ACTION_TYPE.EMAIL_ALERT).map(action => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.LOCAL_ACTION_CALL:
                items = this.invocableActions.filter(action => action.type === ACTION_TYPE.COMPONENT).map(action => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                items = this.apexPlugins.map(apexPlugin => this.getComboItemFromApexPlugin(apexPlugin));
                break;
            case ELEMENT_TYPE.SUBFLOW:
                items = this.subflows.map(subflow => this.getComboItemFromSubflow(subflow));
                break;
            default:
                items = [];
        }
        this.state.actionComboLabel = LABELS[selectedElementType].ACTION_COMBO_LABEL;
        this.state.actionPlaceholder = LABELS[selectedElementType].ACTION_COMBO_PLACEHOLDER;
        this.state.actionMenuData = [{ items }];
    }

    updateTypeCombo() {
        const getTypeOption = (elementType) => {
            return  {
                label : LABELS[elementType].TYPE_OPTION_LABEL,
                value : elementType
            };
        };
        const typeOptions = [getTypeOption(ELEMENT_TYPE.ACTION_CALL)];
        if (this.invocableActions.find(action => action.type === ACTION_TYPE.APEX)) {
            typeOptions.push(getTypeOption(ELEMENT_TYPE.APEX_CALL));
        }
        if (this.apexPlugins.length > 0) {
            typeOptions.push(getTypeOption(ELEMENT_TYPE.APEX_PLUGIN_CALL));
        }
        if (this.invocableActions.find(action => action.type === ACTION_TYPE.EMAIL_ALERT)) {
            typeOptions.push(getTypeOption(ELEMENT_TYPE.EMAIL_ALERT));
        }
        if (this.invocableActions.find(action => action.type === ACTION_TYPE.COMPONENT)) {
            typeOptions.push(getTypeOption(ELEMENT_TYPE.LOCAL_ACTION_CALL));
        }
        if (this.subflows.length > 0) {
            typeOptions.push(getTypeOption(ELEMENT_TYPE.SUBFLOW));
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
            type : 'option-card',
            text : action.label,
            value: action.durableId,
            subText : action.description || ''
        };
    }

    getComboItemFromApexPlugin(apexPlugin) {
        return {
            type : 'option-card',
            text : apexPlugin.name,
            value: apexPlugin.name,
            subText : apexPlugin.Description || ''
        };
    }

    getComboItemFromSubflow(subflow) {
        return {
            type : 'option-card',
            text : subflow.masterLabel,
            value: subflow.developerName,
            subText : subflow.description || ''
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
