import { LightningElement, api, track, unwrap } from 'lwc';
import { ValueChangedEvent } from "builder_platform_interaction/events";
import { ACTION_TYPE, FLOW_PROCESS_TYPE, ELEMENT_TYPE} from "builder_platform_interaction/flowMetadata";
import { fetchOnce, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { filterMatches } from "builder_platform_interaction/expressionUtils";
import { LABELS } from "./actionSelectorLabels";
import { shouldNotBeNullOrUndefined } from 'builder_platform_interaction/validationRules';

export default class ActionSelector extends LightningElement {
    labels = LABELS;
    @track
    state = {
        selectedElementType : ELEMENT_TYPE.ACTION_CALL,
        selectedActionValue : null,
        filteredActionMenuData : [],
        spinnerActive : true,
        actionComboLabel : '',
        actionPlaceholder : '',
        errorMessage : null
    };
    @api
    flowProcessType = FLOW_PROCESS_TYPE.FLOW;

    invocableActions = [];
    invocableActionsFetched = false;
    apexPlugins = [];
    apexPluginsFetched = false;
    subflows = [];
    subflowsFetched = false;
    connected = false;

    fullActionMenuData = [];

    connectedCallback() {
        this.connected = true;
        fetchOnce(SERVER_ACTION_TYPE.GET_APEX_PLUGINS).then((apexPlugins) => {
            if (this.connected) {
                this.apexPlugins = apexPlugins;
                this.apexPluginsFetched = true;
                this.updateComboboxes();
            }
        }).catch(() => {
            if (this.connected) {
                this.apexPluginsFetched = true;
                this.updateComboboxes();
            }
        });
        const keyProvider = (params) => params.flowProcessType;
        fetchOnce(SERVER_ACTION_TYPE.GET_SUBFLOWS, {
            flowProcessType : this.flowProcessType
        }, keyProvider).then((subflows) => {
            if (this.connected) {
                this.subflowsFetched = true;
                this.subflows = subflows;
                this.updateComboboxes();
            }
        }).catch(() => {
            if (this.connected) {
                this.subflowsFetched = true;
                this.updateComboboxes();
            }
        });
        fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
            flowProcessType : this.flowProcessType
        }, keyProvider).then((invocableActions) => {
            if (this.connected) {
                this.invocableActionsFetched = true;
                this.invocableActions = invocableActions;
                this.updateComboboxes();
            }
        }).catch(() => {
            if (this.connected) {
                this.invocableActionsFetched = true;
                this.updateComboboxes();
            }
        });
        this.updateTypeCombo();
        this.updateActionCombo();
    }

    disconnectedCallback() {
        this.connected = false;
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
     * @typedef {Object} ApexPlugin
     *
     * @property {String} apexClass
     * @property {String} description
     * @property {String} name
     * @property {String} tag
     */

    /**
     * @typedef {Object} Subflow
     *
     * @property {String} masterLabel
     * @property {String} description
     * @property {String} developerName
     * @property {String} namespacePrefix
     */

    /**
     * @typedef {Object} SelectedInvocableAction
     * @property {string} elementType the element type (ELEMENT_TYPE.ACTION_CALL, ELEMENT_TYPE.APEX_CALL or ELEMENT_TYPE.EMAIL_ALERT)
     * @property {string} actionType "apex", "quickAction", "component" or same as name for standard invocable actions
     * @property {string} actionName the action name
     */

    /**
     * @typedef {Object} SelectedApexPlugin
     * @property {string} elementType the element type (ELEMENT_TYPE.APEX_PLUGIN_CALL)
     * @property {string} apexClass the apex class
     */

    /**
     * @typedef {Object} SelectedSubflow
     * @property {string} elementType the element type (ELEMENT_TYPE.SUBFLOW)
     * @property {string} flowName the flow name
     */

    /**
     * Set the selected action
     *
     * @param {SelectedInvocableAction|SelectedApexPlugin|SelectedSubflow} newValue the selected action
     */
    set selectedAction(newValue) {
        newValue = unwrap(newValue);
        this.state.selectedElementType = newValue.elementType ? newValue.elementType : ELEMENT_TYPE.ACTION_CALL;
        if (this.state.selectedElementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            this.state.selectedActionValue = newValue.apexClass ? newValue.apexClass : null;
        } else if (this.state.selectedElementType === ELEMENT_TYPE.SUBFLOW) {
            this.state.selectedActionValue = newValue.flowName ? newValue.flowName : null;
        } else {
            this.state.selectedActionValue = newValue.actionType && newValue.actionName ? newValue.actionType + '-' + newValue.actionName : null;
        }
        this.updateActionCombo();
    }

    /**
     * Get the selected action
     *
     * @return {SelectedInvocableAction|SelectedApexPlugin|SelectedSubflow} The selected action
     */
    @api
    get selectedAction() {
        return this.getSelectedActionFrom(this.state.selectedElementType, this.state.selectedActionValue);
    }

    getSelectedActionFrom(elementType, actionValue) {
        let selectedAction = { elementType };
        if (actionValue) {
            if (elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
                const apexPluginFound = this.apexPlugins.find(apexPlugin => apexPlugin.apexClass === actionValue);
                if (apexPluginFound) {
                    selectedAction = Object.assign(selectedAction, {
                        apexClass : apexPluginFound.apexClass
                    });
                }
            } else if (elementType === ELEMENT_TYPE.SUBFLOW) {
                const subflowFound = this.subflows.find(subflow => subflow.fullName === actionValue);
                if (subflowFound) {
                    selectedAction = Object.assign(selectedAction, {
                        flowName : subflowFound.fullName,
                    });
                }
            } else {
                const actionFound = this.invocableActions.find(action => action.durableId === actionValue);
                if (actionFound) {
                    selectedAction = Object.assign(selectedAction, {
                        actionName : actionFound.name,
                        actionType : actionFound.type,
                    });
                }
            }
        }
        return selectedAction;
    }

    @api
    get errorMessage() {
        return this.state.errorMessage;
    }

    set errorMessage(value) {
        this.state.errorMessage = value;
    }

    get actionComboDisabled() {
        return this.fullActionMenuData.length === 0;
    }

    get actionComboLabel() {
        return LABELS[this.state.selectedElementType].ACTION_COMBO_LABEL;
    }

    get actionComboPlaceholder() {
        return LABELS[this.state.selectedElementType].ACTION_COMBO_PLACEHOLDER;
    }

    get actionComboValue() {
        // value for combobox is {menuDataRetrieval.MenuItem|String|null|undefined}
        const menuItem = this.fullActionMenuData.find(element => element.value === this.state.selectedActionValue);
        if (menuItem) {
            return menuItem;
        }
        return this.state.selectedActionValue;
    }

    updateComboboxes() {
        if (this.apexPluginsFetched && this.invocableActionsFetched && this.subflowsFetched) {
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
                items = this.invocableActions.filter(action => action.isStandard || action.type === ACTION_TYPE.QUICK_ACTION || action.type === ACTION_TYPE.COMPONENT).map(action => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.APEX_CALL:
                items = this.invocableActions.filter(action => action.type === ACTION_TYPE.APEX).map(action => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.EMAIL_ALERT:
                items = this.invocableActions.filter(action => action.type === ACTION_TYPE.EMAIL_ALERT).map(action => this.getComboItemFromInvocableAction(action));
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
        this.fullActionMenuData = this.state.filteredActionMenuData = items;
    }

    updateTypeCombo() {
        const getTypeOption = (elementType) => {
            return  {
                label : LABELS[elementType].TYPE_OPTION_LABEL,
                value : elementType
            };
        };
        const typeOptions = [getTypeOption(ELEMENT_TYPE.ACTION_CALL)];
        typeOptions.push(getTypeOption(ELEMENT_TYPE.APEX_CALL));
        typeOptions.push(getTypeOption(ELEMENT_TYPE.APEX_PLUGIN_CALL));
        typeOptions.push(getTypeOption(ELEMENT_TYPE.EMAIL_ALERT));
        typeOptions.push(getTypeOption(ELEMENT_TYPE.SUBFLOW));
        this.state.typeOptions = typeOptions;
    }

    handleElementTypeChanged(event) {
        event.stopPropagation();
        const selectedElementType = event.detail.value;
        const newSelectedAction = this.getSelectedActionFrom(selectedElementType, null);
        const valueChangedEvent = new ValueChangedEvent(newSelectedAction);
        this.dispatchEvent(valueChangedEvent);
    }

    getComboItemFromInvocableAction(action) {
        let subText;
        if (action.type === ACTION_TYPE.QUICK_ACTION) {
            const object = this.getQuickActionObject(action);
            // TODO add {Category} when available
            subText = object || this.labels.globalQuickActionSubTextPrefix;
            subText += (action.description ? ' - ' + action.description : '');
        } else {
            subText = action.description || '';
        }
        return {
            type : 'option-card',
            text : action.label,
            value: action.durableId,
            displayText: action.label,
            subText
        };
    }

    /**
     * Get the object devName from quick action.
     *
     * @param {InvocableAction} action the quick action
     * @return {string|undefined} the object devName or undefined if global quick action
     */
    getQuickActionObject(action) {
        // Case.mynamespace__NewChildCase for object quick action
        // mynamespace__NewCase for global quick action
        const parts = action.name.split('.');
        if (parts.length === 2) {
            return parts[0];
        }
        return undefined;
    }

    getComboItemFromApexPlugin(apexPlugin) {
        return {
            type : 'option-card',
            text : apexPlugin.name,
            value: apexPlugin.apexClass,
            displayText: apexPlugin.name,
            subText : apexPlugin.description || ''
        };
    }

    getComboItemFromSubflow(subflow) {
        return {
            type : 'option-card',
            text : subflow.masterLabel,
            value: subflow.fullName,
            displayText: subflow.masterLabel,
            subText : subflow.fullName + (subflow.description ? ' - ' + subflow.description : '')
        };
    }

    handleActionChanged(event) {
        event.stopPropagation();
        const { item } = event.detail;
        let newSelectedActionValue;
        if (item === null) {
            // typed something that does not match an item
            newSelectedActionValue = null;
        } else {
            if (this.state.selectedActionValue === item.value) {
                return;
            }
            newSelectedActionValue = item.value;
        }
        const newSelectedAction = this.getSelectedActionFrom(this.state.selectedElementType, newSelectedActionValue);
        const error = shouldNotBeNullOrUndefined(newSelectedActionValue);
        const valueChangedEvent = new ValueChangedEvent(newSelectedAction, error);
        this.dispatchEvent(valueChangedEvent);
    }

    handleFilterMatches(event) {
        this.state.filteredActionMenuData = filterMatches(event.detail.value, this.fullActionMenuData, event.detail.isMergeField);
    }
}
