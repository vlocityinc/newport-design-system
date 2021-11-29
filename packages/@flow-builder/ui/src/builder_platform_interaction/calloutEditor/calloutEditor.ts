// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE, ACTION_TYPE, ACTION_TYPE_TO_ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { shouldNotBeNullOrUndefined } from 'builder_platform_interaction/validationRules';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { ClosePropertyEditorEvent } from 'builder_platform_interaction/events';
import { LABELS } from './calloutEditorLabels';
import { FilterBy } from 'builder_platform_interaction/actionSelector';

const CONTAINER_SELECTOR = 'builder_platform_interaction-callout-editor-container';

export default class CalloutEditor extends LightningElement {
    /**
     * Internal state for the editor
     */
    @track calloutNode = {};
    /**
     * A SelectedInvocableAction|SelectedApexPlugin|SelectedSubflow
     */
    @track selectedAction = {};

    @track selectedActionError = null;

    @track hasActions = {};

    @track selectedFilterBy = FilterBy.Category;
    @track showLeftPanel = true;
    @track showActionSelector = true;
    @track categoryOptions = [];
    @track selectedCategory = LABELS.allInvocableActions;
    @track invocableActions = [];
    @track invocableActionsFetched = false;

    labels = LABELS;
    location = {};
    processTypeValue = '';
    triggerTypeValue = '';

    connectedCallback() {
        fetchOnce(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
            flowProcessType: this.processTypeValue,
            flowTriggerType: this.triggerTypeValue
        })
            .then((invocableActions) => {
                this.invocableActionsFetched = true;
                this.invocableActions = invocableActions;
                const selectedTypeOption =
                    ACTION_TYPE_TO_ELEMENT_TYPE[getValueFromHydratedItem(this.calloutNode.actionType)];
                if (this.isCustomAction && selectedTypeOption) {
                    this.selectedFilterBy = FilterBy.Type;
                    this.selectedCategory = selectedTypeOption;
                }
                // Set options
                this.setCategoryOptions();
            })
            .catch(() => {
                this.invocableActionsFetched = true;
            });
    }

    get filterByOptions() {
        return [
            {
                label: LABELS.filterByCategoryOption,
                value: FilterBy.Category
            },
            {
                label: LABELS.filterByTypeOption,
                value: FilterBy.Type
            }
        ];
    }

    get isCustomAction() {
        // return true if and only if actionIsStandard is false
        return !(this.calloutNode.actionIsStandard ?? true);
    }

    @api
    get node() {
        return this.calloutNode;
    }

    set node(newValue) {
        this.calloutNode = newValue || {};
        this.location.locationX = this.calloutNode.locationX;
        this.location.locationY = this.calloutNode.locationY;
        // Only show left panel if element is not a subflow and not a palette promoted action or if it's a custom action
        this.showLeftPanel =
            (this.calloutNode.elementType !== ELEMENT_TYPE.SUBFLOW &&
                !getValueFromHydratedItem(this.calloutNode.actionType)) ||
            this.isCustomAction;
        // Only show action selector if element is not a palette promoted action or if it's a custom action
        this.showActionSelector = !getValueFromHydratedItem(this.calloutNode.actionType) || this.isCustomAction;
        this.updateSelectedAction();
    }

    @api
    getNode() {
        return this.template.querySelector(CONTAINER_SELECTOR).getNode();
    }

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    @api
    editorParams;

    /**
     * @returns {FLOW_PROCESS_TYPE} Flow process Type supports automatic output handling
     */
    @api
    get processType() {
        return this.processTypeValue;
    }

    set processType(newValue) {
        this.processTypeValue = newValue;
    }

    /**
     * @returns {FLOW_TRIGGER_TYPE}
     */
    @api
    get triggerType() {
        return this.triggerTypeValue;
    }

    set triggerType(newValue) {
        this.triggerTypeValue = newValue;
    }

    /**
     * Calls validate method on the container component that contains the inner property editor
     * This method is called on OK by the property editor footer component for validation
     *
     * @returns {Array} the array of errors from validation call
     */
    @api
    validate() {
        const container = this.template.querySelector(CONTAINER_SELECTOR);
        // check the referenced action combobox
        this.validateSelectedAction();
        if (this.selectedActionError) {
            return [this.selectedActionError];
        }
        // if we don't have an error then we can call validate on our container which will then call validate on the chosen editor
        return container.validate();
    }

    updateSelectedAction() {
        let newSelectedAction = {
            elementType: this.node.elementType,
            guid: this.node.guid
        };
        if (this.node.elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
            const apexClass = getValueFromHydratedItem(this.node.apexClass);
            if (apexClass) {
                newSelectedAction = Object.assign(newSelectedAction, {
                    apexClass
                });
            }
        } else if (this.node.elementType === ELEMENT_TYPE.SUBFLOW) {
            this.selectedFilterBy = FilterBy.Type;
            const flowName = getValueFromHydratedItem(this.node.flowName);
            if (flowName) {
                newSelectedAction = Object.assign(newSelectedAction, {
                    flowName
                });
            }
        } else {
            // all invocable actions
            const actionType = getValueFromHydratedItem(this.node.actionType);
            const actionName = getValueFromHydratedItem(this.node.actionName);
            if (actionType && actionName) {
                newSelectedAction = Object.assign(newSelectedAction, {
                    actionName,
                    actionType
                });
            }
        }

        this.selectedAction = newSelectedAction;
    }

    validateSelectedAction() {
        if (this.selectedActionError === null) {
            if (this.selectedAction.elementType === ELEMENT_TYPE.APEX_PLUGIN_CALL) {
                this.selectedActionError = shouldNotBeNullOrUndefined(this.selectedAction.apexClass);
            } else if (this.selectedAction.elementType === ELEMENT_TYPE.SUBFLOW) {
                this.selectedActionError = shouldNotBeNullOrUndefined(this.selectedAction.flowName);
            } else {
                this.selectedActionError = shouldNotBeNullOrUndefined(this.selectedAction.actionName);
            }
        }
    }

    setCategoryOptions() {
        if (this.selectedFilterBy === FilterBy.Type) {
            const getTypeOption = (elementType) => {
                return {
                    label: this.labels[elementType].TYPE_OPTION_LABEL,
                    name: elementType
                };
            };

            const typeOptions = [getTypeOption(ELEMENT_TYPE.ACTION_CALL)];
            typeOptions.push(getTypeOption(ELEMENT_TYPE.APEX_CALL));
            typeOptions.push(getTypeOption(ELEMENT_TYPE.APEX_PLUGIN_CALL));
            typeOptions.push(getTypeOption(ELEMENT_TYPE.EMAIL_ALERT));
            if (this.invocableActions.some((action) => action.type === ACTION_TYPE.EXTERNAL_SERVICE)) {
                typeOptions.push(getTypeOption(ELEMENT_TYPE.EXTERNAL_SERVICE));
            }
            this.categoryOptions = typeOptions;
        } else {
            const duplicateCategories = new Set();
            this.categoryOptions = this.invocableActions.reduce((result, action) => {
                if (action.category && !duplicateCategories.has(action.category)) {
                    duplicateCategories.add(action.category);
                    result.push({
                        label: action.category,
                        name: action.category
                    });
                }
                return result;
            }, []);

            this.categoryOptions.push({
                label: LABELS.unCategorizedInvocableActions,
                name: LABELS.unCategorizedInvocableActions
            });
            this.categoryOptions.unshift({
                label: LABELS.allInvocableActions,
                name: LABELS.allInvocableActions
            });
        }
    }

    handleActionSelected(event) {
        event.stopPropagation();
        this.selectedAction = Object.assign({}, event.detail.value, {
            guid: this.node.guid
        });

        this.selectedActionError = event.detail.error;
    }

    handleCannotRetrieveParameters(event) {
        event.stopPropagation();
        // reset selected action
        this.selectedAction = { elementType: this.selectedAction.elementType, guid: this.node.guid };
    }

    handleCannotRetrieveActions(event) {
        event.stopPropagation();
        const closePropertyEditorEvent = new ClosePropertyEditorEvent();
        this.dispatchEvent(closePropertyEditorEvent);
    }

    handleActionsLoaded(event) {
        this.hasActions = { value: !(event.detail.number === 0) }; // only set it when the event explicitly says it has 0
    }

    handleFilterByChange(event) {
        this.selectedFilterBy = event.detail.value;
        this.setCategoryOptions();
    }

    handleCategorySelect(event) {
        this.selectedCategory = event.detail.name;

        if (this.selectedFilterBy === FilterBy.Type) {
            this.selectedAction = {
                elementType: this.selectedCategory,
                guid: this.node.guid
            };
        } else {
            this.selectedAction = {
                elementType: ELEMENT_TYPE.ACTION_CALL,
                guid: this.node.guid
            };
        }
    }
}
