// @ts-nocheck
import { LightningElement, api, track, unwrap } from 'lwc';
import { ValueChangedEvent, CannotRetrieveActionsEvent, ActionsLoadedEvent } from 'builder_platform_interaction/events';
import { ACTION_TYPE, FLOW_PROCESS_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { filterMatches } from 'builder_platform_interaction/expressionUtils';
import { LABELS } from './actionSelectorLabels';
import genericErrorMessage from '@salesforce/label/FlowBuilderCombobox.genericErrorMessage';
import cannotBeBlank from '@salesforce/label/FlowBuilderValidation.cannotBeBlank';
import { format } from 'builder_platform_interaction/commonUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';

type ElementActionType = {
    elementType: string;
    actionType: string;
};

const allElementActionTypes: ElementActionType[] = [
    { elementType: ELEMENT_TYPE.ACTION_CALL, actionType: ACTION_TYPE.QUICK_ACTION },
    { elementType: ELEMENT_TYPE.ACTION_CALL, actionType: ACTION_TYPE.COMPONENT },
    { elementType: ELEMENT_TYPE.ACTION_CALL, actionType: ACTION_TYPE.CREATE_WORK_ITEM },
    { elementType: ELEMENT_TYPE.ACTION_CALL, actionType: ACTION_TYPE.FLOW },
    { elementType: ELEMENT_TYPE.ACTION_CALL, actionType: ACTION_TYPE.OUTBOUND_MESSAGE },
    { elementType: ELEMENT_TYPE.EXTERNAL_SERVICE, actionType: ACTION_TYPE.EXTERNAL_SERVICE },
    { elementType: ELEMENT_TYPE.APEX_CALL, actionType: ACTION_TYPE.APEX },
    { elementType: ELEMENT_TYPE.EMAIL_ALERT, actionType: ACTION_TYPE.EMAIL_ALERT }
];

const getElementType = (actionType: string): string => {
    const elementTypeFound = allElementActionTypes.find(
        (elementActionType) => elementActionType.actionType === actionType
    );
    return elementTypeFound ? elementTypeFound.elementType : ELEMENT_TYPE.ACTION_CALL;
};

const getActionTypes = (elementType: string): string[] => {
    return allElementActionTypes
        .filter((elementActionType) => elementActionType.elementType === elementType)
        .reduce((acc, elementActionType) => [...acc, elementActionType.actionType], []);
};

export default class ActionSelector extends LightningElement {
    private labels = LABELS;
    @track
    state = {
        selectedElementType: ELEMENT_TYPE.ACTION_CALL,
        selectedActionValue: null,
        filteredActionMenuData: [],
        spinnerActive: true,
        actionPlaceholder: '',
        errorMessage: null
    };
    @api
    flowProcessType = FLOW_PROCESS_TYPE.FLOW;

    @api labelOverride: string | null = null;

    @api required = false;

    @api fieldLevelHelp = null;

    private readonly elementTypeToLabelMap = {
        [ELEMENT_TYPE.ACTION_CALL]: this.labels.actionSearchInputLabel,
        [ELEMENT_TYPE.EXTERNAL_SERVICE]: this.labels.actionSearchInputLabel,
        [ELEMENT_TYPE.APEX_CALL]: this.labels.actionSearchInputLabel,
        [ELEMENT_TYPE.APEX_PLUGIN_CALL]: this.labels.actionSearchInputLabel,
        [ELEMENT_TYPE.EMAIL_ALERT]: this.labels.actionSearchInputLabel,
        [ELEMENT_TYPE.SUBFLOW]: this.labels.flowSearchInputLabel
    };

    apexPlugins = [];
    apexPluginsFetched = false;
    subflows = [];
    subflowsFetched = false;
    connected = false;
    _invocableActions = [];
    _invocableActionsFetched = false;
    _selectedCategory = LABELS.allInvocableActions;
    _selectedFilterBy = LABELS.filterByCategoryOption;

    fullActionMenuData = [];

    connectedCallback() {
        this.connected = true;
        fetchOnce(SERVER_ACTION_TYPE.GET_APEX_PLUGINS)
            .then((apexPlugins) => {
                if (this.connected) {
                    this.apexPlugins = apexPlugins;
                    this.apexPluginsFetched = true;
                    this.updateComboboxes();
                }
            })
            .catch(() => {
                if (this.connected) {
                    this.apexPluginsFetched = true;
                    this.updateComboboxes();
                    this.dispatchCannotRetrieveActionsEvent();
                }
            });
        const { definitionId: flowDefinitionId } = Store.getStore().getCurrentState().properties;
        fetchOnce(SERVER_ACTION_TYPE.GET_SUBFLOWS, {
            flowProcessType: this.flowProcessType,
            flowDefinitionId
        })
            .then((subflows) => {
                if (this.connected) {
                    this.subflowsFetched = true;
                    this.subflows = subflows;
                    this.updateComboboxes();
                }
            })
            .catch(() => {
                if (this.connected) {
                    this.subflowsFetched = true;
                    this.updateComboboxes();
                    this.dispatchCannotRetrieveActionsEvent();
                }
            });
        this.updateActionCombo();
    }

    dispatchCannotRetrieveActionsEvent() {
        const event = new CannotRetrieveActionsEvent();
        this.dispatchEvent(event);
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
    set selectedAction(newValue: any | null) {
        if (newValue) {
            newValue = unwrap(newValue);
            this.state.selectedElementType = newValue.elementType ? newValue.elementType : ELEMENT_TYPE.ACTION_CALL;
            if (this.state.selectedElementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
                this.state.selectedActionValue = newValue.apexClass ? newValue.apexClass : null;
            } else if (this.state.selectedElementType === ELEMENT_TYPE.SUBFLOW) {
                this.state.selectedActionValue = newValue.flowName ? newValue.flowName : null;
            } else {
                this.state.selectedActionValue =
                    newValue.actionType && newValue.actionName ? newValue.actionType + '-' + newValue.actionName : null;
            }

            this.updateActionCombo();
        } else {
            this.state.selectedActionValue = null;
        }
    }

    get label() {
        return this.labelOverride ? this.labelOverride : this.elementTypeToLabelMap[this.state.selectedElementType];
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
                const apexPluginFound = this.apexPlugins.find((apexPlugin) => apexPlugin.apexClass === actionValue);
                if (apexPluginFound) {
                    selectedAction = Object.assign(selectedAction, {
                        apexClass: apexPluginFound.apexClass
                    });
                }
            } else if (elementType === ELEMENT_TYPE.SUBFLOW) {
                const subflowFound = this.subflows.find((subflow) => subflow.fullName === actionValue);
                if (subflowFound) {
                    selectedAction = Object.assign(selectedAction, {
                        flowName: subflowFound.fullName
                    });
                }
            } else {
                const actionFound = this._invocableActions.find((action) => action.durableId === actionValue);
                if (actionFound) {
                    selectedAction = Object.assign(selectedAction, {
                        actionName: actionFound.name,
                        actionType: actionFound.type
                    });
                }
            }
        }
        if (selectedAction.elementType === ELEMENT_TYPE.ACTION_CALL && selectedAction.actionType) {
            selectedAction.elementType = getElementType(selectedAction.actionType);
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

    @api
    get invocableActions() {
        return this._invocableActions;
    }

    set invocableActions(value) {
        this._invocableActions = value;
    }

    @api
    get invocableActionsFetched() {
        return this._invocableActionsFetched;
    }

    set invocableActionsFetched(value) {
        this._invocableActionsFetched = value;
        this.updateComboboxes();
    }

    @api
    get selectedCategory() {
        return this._selectedCategory;
    }

    set selectedCategory(value) {
        this._selectedCategory = value;
        if (!this._selectedFilterBy || this._selectedFilterBy === this.labels.filterByCategoryOption) {
            this.updateActionCombo();
        }
    }

    @api
    get selectedFilterBy() {
        return this._selectedFilterBy;
    }

    set selectedFilterBy(value) {
        this._selectedFilterBy = value;
        if (this.state.selectedElementType !== ELEMENT_TYPE.SUBFLOW && value === this.labels.filterByTypeOption) {
            this.state.selectedElementType = ELEMENT_TYPE.ACTION_CALL;
            this._selectedCategory = ELEMENT_TYPE.ACTION_CALL;
        } else {
            this._selectedCategory = this.labels.allInvocableActions;
        }
        this.updateActionCombo();
    }

    get actionComboDisabled() {
        return this.fullActionMenuData.length === 0;
    }

    get actionComboPlaceholder() {
        return this.state.spinnerActive ? this.labels.loading : this.state.actionPlaceholder;
    }

    get actionComboValue() {
        // value for combobox is {menuDataRetrieval.MenuItem|String|null|undefined}
        const menuItem = this.fullActionMenuData.find((element) => element.value === this.state.selectedActionValue);
        if (menuItem) {
            return menuItem;
        }
        return this.state.selectedActionValue;
    }

    updateComboboxes() {
        if (this.apexPluginsFetched && this._invocableActionsFetched && this.subflowsFetched) {
            this.updateActionCombo();
            this.state.spinnerActive = false;
        }
    }

    getActionElementsByCategory(selectedCategory) {
        const isAllAction = !selectedCategory || selectedCategory === this.labels.allInvocableActions;
        const filteredActions = isAllAction
            ? this._invocableActions
            : selectedCategory &&
              selectedCategory.toLowerCase() === this.labels.unCategorizedInvocableActions.toLowerCase()
            ? this._invocableActions.filter(
                  (action) => !action.category || action.category.toLowerCase() === selectedCategory.toLowerCase()
              )
            : this._invocableActions.filter(
                  (action) => action.category && action.category.toLowerCase() === selectedCategory.toLowerCase()
              );
        const items = filteredActions.map((action) => this.getComboItemFromInvocableAction(action));

        const categoryLabel = isAllAction ? this.labels.allInvocableActions.toLowerCase() : selectedCategory;

        this.state.actionPlaceholder = format(
            LABELS.categoryComboboxPlaceholder,
            !isAllAction &&
                filteredActions &&
                filteredActions.length &&
                filteredActions[0].type === ACTION_TYPE.EXTERNAL_SERVICE
                ? categoryLabel
                : categoryLabel.toLowerCase()
        );
        return items;
    }

    getActionElementsByType(selectedElementType) {
        let items = [];
        const actionTypes = getActionTypes(selectedElementType);
        switch (selectedElementType) {
            case ELEMENT_TYPE.ACTION_CALL:
                items = this._invocableActions
                    .filter((action) => action.isStandard || actionTypes.includes(action.type))
                    .map((action) => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.APEX_CALL:
            case ELEMENT_TYPE.EMAIL_ALERT:
            case ELEMENT_TYPE.EXTERNAL_SERVICE:
                items = this._invocableActions
                    .filter((action) => actionTypes.includes(action.type))
                    .map((action) => this.getComboItemFromInvocableAction(action));
                break;
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                items = this.apexPlugins.map((apexPlugin) => this.getComboItemFromApexPlugin(apexPlugin));
                break;
            case ELEMENT_TYPE.SUBFLOW:
                items = this.subflows.map((subflow) => this.getComboItemFromSubflow(subflow));
                break;
            default:
                items = [];
        }

        this.state.actionPlaceholder = this.labels[selectedElementType].ACTION_COMBO_PLACEHOLDER;
        return items;
    }

    updateActionCombo() {
        const selectedCategory = this._selectedCategory;
        const selectedElementType = this.state.selectedElementType;

        let items;
        // If selected element type is flows, we return flows actions
        if (
            selectedElementType === ELEMENT_TYPE.SUBFLOW ||
            this._selectedFilterBy !== this.labels.filterByCategoryOption
        ) {
            items = this.getActionElementsByType(selectedElementType);
        } else {
            items = this.getActionElementsByCategory(selectedCategory);
        }

        this.fullActionMenuData = items;
        this.state.filteredActionMenuData = this.state.selectedActionValue
            ? filterMatches(this.state.selectedActionValue, this.fullActionMenuData, false)
            : this.fullActionMenuData;
        // dispatch event up so that other cmps know to render 'no available actions of this type'
        const newSelectedAction = this.getSelectedActionFrom(
            this._selectedFilterBy === this.labels.filterByCategoryOption ? selectedCategory : selectedElementType,
            null
        );
        const valueChangedEvent = new ActionsLoadedEvent(newSelectedAction, this.fullActionMenuData.length);
        this.dispatchEvent(valueChangedEvent);
    }

    handleElementTypeChanged(event) {
        event.stopPropagation();
        const selectedElementType = event.detail.value;
        const newSelectedAction = this.getSelectedActionFrom(selectedElementType, null);
        const valueChangedEvent = new ValueChangedEvent<InvocableAction>(newSelectedAction);
        this.dispatchEvent(valueChangedEvent);
    }

    getComboItemFromInvocableAction(action) {
        return {
            type: 'option-card',
            text: action.label,
            value: action.durableId,
            displayText: action.label,
            subText: action.durableId
        };
    }

    getComboItemFromApexPlugin(apexPlugin) {
        return {
            type: 'option-card',
            text: apexPlugin.name,
            value: apexPlugin.apexClass,
            displayText: apexPlugin.name,
            subText: apexPlugin.apexClass
        };
    }

    getComboItemFromSubflow(subflow) {
        return {
            type: 'option-card',
            text: subflow.masterLabel,
            value: subflow.fullName,
            displayText: subflow.masterLabel,
            subText: subflow.fullName
        };
    }

    handleActionChanged(event) {
        event.stopPropagation();
        const { item, displayText } = event.detail;
        let newSelectedActionValue;
        let error = null;
        if (item === null) {
            // typed something that does not match an item
            newSelectedActionValue = null;
            if (displayText !== '') {
                error = genericErrorMessage;
            } else {
                error = cannotBeBlank;
            }
        } else {
            if (this.state.selectedActionValue === item.value) {
                return;
            }
            newSelectedActionValue = item.value;
        }
        const newSelectedAction = this.getSelectedActionFrom(this.state.selectedElementType, newSelectedActionValue);
        const valueChangedEvent = new ValueChangedEvent(newSelectedAction, error);
        this.dispatchEvent(valueChangedEvent);
    }

    handleFilterMatches(event) {
        this.state.filteredActionMenuData = filterMatches(
            event.detail.value,
            this.fullActionMenuData,
            event.detail.isMergeField
        );
    }
}
