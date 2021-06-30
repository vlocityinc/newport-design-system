// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { recordChangeTriggerReducer } from './recordChangeTriggerReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { LABELS, requireRecordChangeOptions } from './recordChangeTriggerLabels';
import { mergeErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import {
    ELEMENT_TYPE,
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_SAVE_TYPE,
    START_ELEMENT_FIELDS,
    SCHEDULED_PATH_TYPE,
    EXECUTE_OUTCOME_WHEN_OPTION_VALUES,
    CONDITION_LOGIC
} from 'builder_platform_interaction/flowMetadata';
import { loadOperatorsAndRulesOnTriggerTypeChange } from 'builder_platform_interaction/preloadLib';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import { fetchFieldsForEntity, ENTITY_TYPE } from 'builder_platform_interaction/sobjectLib';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    isScheduledTriggerType,
    getTriggerTypeInfo,
    getTriggerHasCriteria,
    isRecordChangeTriggerType
} from 'builder_platform_interaction/triggerTypeLib';
import { FlowComparisonOperator } from 'builder_platform_interaction/flowMetadata';

const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE, SCHEDULED, SCHEDULED_JOURNEY } = FLOW_TRIGGER_TYPE;
const { CREATE, UPDATE, CREATE_AND_UPDATE, DELETE } = FLOW_TRIGGER_SAVE_TYPE;

/**
 * Property Editor record change trigger
 */
export default class RecordChangeTriggerEditor extends LightningElement {
    /**
     * Internal state for the record change trigger editor
     */
    @track
    startElement;

    @track
    _fields = {};

    @track
    _configurationEditor;

    labels = LABELS;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    @api
    editorParams;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    private disableRecordChangeOptionsIndicator = false;

    // Stores the flow trigger type value which needs to be set to if the user
    // decides to switch back from DELETE to CREATE, UPDATE or CREATEUPDATE
    oldFlowTriggerType = '';

    get beforeAfterSaveItems() {
        return [
            {
                itemId: BEFORE_SAVE,
                label: this.labels.triggerTypeBeforeSave,
                description: this.labels.triggerTypeBeforeSaveDescription,
                isSelected: this.isBeforeSave,
                iconName: null
            },
            {
                itemId: AFTER_SAVE,
                label: this.labels.triggerTypeAfterSave,
                description: this.labels.triggerTypeAfterSaveDescription,
                isSelected: this.isAfterSave,
                iconName: null
            }
        ];
    }

    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        const oldHasError = this.startElement?.config?.hasError;
        this.startElement = mergeErrorsFromHydratedElement(newValue, this.startElement);

        if (this.startElement?.config?.hasError !== oldHasError) {
            this.dispatchEvent(new UpdateNodeEvent(this.startElement));
        }

        // Reopening existing elements should always validate
        // This has to be done manually in every property editor
        if (!newValue.isNew) {
            this.validate();
        }
    }

    /**
     * public api function to return the node
     *
     * @returns node - node
     */
    @api
    getNode(): object {
        return this.startElement;
    }

    get disableConditionLogicPicker() {
        return this.triggerHasCriteria ? false : true;
    }

    get configurationEditor() {
        if (this.triggerType) {
            // Get the current trigger type info and set the custom property editor info if one is defined,
            // else, load fields for the selected context object
            getTriggerTypeInfo(this.triggerType).then((data) => {
                if (data && data.configurationEditor) {
                    this._configurationEditor = { name: data.configurationEditor };
                }
            });
        }
        return this._configurationEditor;
    }

    get requireRecordChangeOption() {
        return this.startElement.doesRequireRecordChangedToMeetCriteria
            ? EXECUTE_OUTCOME_WHEN_OPTION_VALUES.ONLY_WHEN_CHANGES_MEET_CONDITIONS
            : EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;
    }

    get elementType() {
        if (isRecordChangeTriggerType(this.triggerType)) {
            return ELEMENT_TYPE.START_ON_DML;
        }
        return ELEMENT_TYPE.START_ELEMENT;
    }

    get triggerType() {
        return this.startElement.triggerType ? this.startElement.triggerType.value : BEFORE_SAVE;
    }

    get saveType() {
        return this.startElement.recordTriggerType ? this.startElement.recordTriggerType.value : CREATE;
    }

    get runOnSuccessScheduledPathCheckboxLabel() {
        return LABELS.runOnSuccessScheduledPathCheckboxLabel;
    }

    get checkRunOnSuccessScheduledPath() {
        return (
            this.startElement.scheduledPaths &&
            this.startElement.scheduledPaths.length > 0 &&
            this.startElement.scheduledPaths[0].pathType?.value === SCHEDULED_PATH_TYPE.RUN_ON_SUCCESS
        );
    }

    get createOrUpdateOptions() {
        return [
            {
                label: LABELS.recordTriggerTypeCreated,
                value: CREATE
            },
            {
                label: LABELS.recordTriggerTypeUpdated,
                value: UPDATE
            },
            {
                label: LABELS.recordTriggerTypeCreatedOrUpdated,
                value: CREATE_AND_UPDATE
            },
            {
                label: LABELS.recordTriggerTypeDeleted,
                value: DELETE
            }
        ];
    }

    get triggerTypeOptions() {
        return [
            {
                label: LABELS.triggerTypeBeforeSave,
                value: BEFORE_SAVE
            },
            {
                label: LABELS.triggerTypeBeforeDelete,
                value: BEFORE_DELETE
            },
            {
                label: LABELS.triggerTypeAfterSave,
                value: AFTER_SAVE
            }
        ];
    }

    get isBeforeSave() {
        return this.startElement.triggerType.value === BEFORE_SAVE;
    }

    get isAfterSave() {
        return this.startElement.triggerType.value === AFTER_SAVE;
    }

    get isBeforeDelete() {
        return this.startElement.triggerType.value === BEFORE_DELETE;
    }

    get isDeleteRecordTriggerType() {
        return this.startElement.recordTriggerType.value === DELETE;
    }

    get disableRunOnSuccessScheduledPathCheckbox() {
        return !this.isAfterSave;
    }

    get showScheduleSection() {
        return isScheduledTriggerType(this.triggerType);
    }

    get showCriteriaSection() {
        return getTriggerHasCriteria(this.triggerType);
    }

    get triggerHasCriteria() {
        return this.recordEntityName && this.showCriteriaSection && !this.startElement.object.error;
    }

    get editTriggerObjectLabel() {
        return this.labels.editTriggerObjectLabel;
    }

    get editTriggerLabel() {
        return this.labels.editTriggerLabel;
    }

    get editTriggerDescription() {
        return this.labels.editTriggerDescription;
    }

    get setConditionsHeaderLabel() {
        return this.labels.setConditionsHeaderLabel;
    }

    get setConditionsDescription() {
        return this.labels.setConditionsDescription;
    }

    get contextObjectDescription() {
        switch (this.triggerType) {
            case BEFORE_DELETE:
                return this.labels.contextObjectDeleteDescription;
            case BEFORE_SAVE:
            case AFTER_SAVE:
                return this.labels.contextObjectDescription;
            case SCHEDULED:
            case SCHEDULED_JOURNEY:
                return this.labels.filterRecordsDescription;
            default:
                return '';
        }
    }

    get queryableFilter() {
        return ENTITY_TYPE.QUERYABLE;
    }

    get workflowEnabledFilter() {
        return ENTITY_TYPE.WORKFLOW_ENABLED;
    }

    /**
     * set the entity name (object) and  load fields accordingly
     */
    set recordEntityName(newValue: string) {
        this.startElement.object.value = newValue;
        this.updateSelectedEntityFields();
    }

    /**
     * @returns entity name (object)
     */
    get recordEntityName(): string {
        return this.startElement.object.value;
    }

    /**
     * @returns the entity fields
     */
    get recordFields(): object {
        this.updateSelectedEntityFields();
        return this._fields;
    }

    get disableRecordChangeOptions(): boolean {
        return this.disableRecordChangeOptionsIndicator;
    }

    /**
     * @returns configuration to pass to entity-resource-picker component
     */
    get entityComboboxConfig(): object {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object, // Label
            this.labels.objectPlaceholder, // Placeholder
            this.startElement.object.error, // errorMessage
            false, // literalsAllowed
            false, // required
            false, // disabled
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
     * @returns configuration to pass to entity-resource-picker component. This is a required field
     */
    get entityComboboxConfigRequired(): object {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object, // Label
            this.labels.objectPlaceholder, // Placeholder
            this.startElement.object.error, // errorMessage
            false, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
     * @returns whether the current triggr type supports a custom property editor for context selection (eg. Journey Builder)
     */
    get hasConfigurationEditor(): boolean {
        return !!this._configurationEditor;
    }

    /**
     * @returns values to pass in to the custom property editor
     */
    get configurationEditorValues(): [] {
        return [
            {
                name: 'objectContainer',
                value: this.startElement.objectContainer && this.startElement.objectContainer.value
            }
        ];
    }

    get triggerSaveType() {
        return this._triggerSaveType;
    }

    /**
     * public api function to run the rules from record change trigger validation library
     *
     * @returns list of errors
     */
    @api
    validate(): [] {
        const event = { type: VALIDATE_ALL };
        this.startElement = recordChangeTriggerReducer(this.startElement, event);

        let errors = getErrorsFromHydratedElement(this.startElement);

        if (this._configurationEditor) {
            const customPropertyEditor = this.template.querySelector(
                'builder_platform_interaction-custom-property-editor'
            );
            if (customPropertyEditor) {
                const cpeErrors = customPropertyEditor.validate();
                errors = [...errors, ...cpeErrors];
            }
        }

        return errors;
    }

    /**
     * update the fields of the selected entity
     */
    async updateSelectedEntityFields() {
        try {
            if (this.recordEntityName) {
                this._fields = await fetchFieldsForEntity(this.recordEntityName);
            }
        } catch (err) {
            // fetchFieldsForEntity displays an error message
        }
    }

    /**
     * Updates a field by creating a PropertyChangedEvent and passing it to the reducer
     *
     * @param prop - the name of the field to update
     * @param value - the value for the field
     */
    _updateField(prop: string, value: string) {
        const event = new PropertyChangedEvent(prop, value);
        this.startElement = recordChangeTriggerReducer(this.startElement, event);

        // For property editor in a panel
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }

    /**
     * Handles Record Trigger Type and Flow Trigger Type radio button selection in Configure Trigger Modal
     *
     * @param event Change event with the new save type value
     */
    handleTriggerSaveTypeChange = async (event) => {
        const newTriggerTypeVal = event.detail.value;
        this._triggerSaveType = newTriggerTypeVal;
        this._updateField(START_ELEMENT_FIELDS.TRIGGER_SAVE_TYPE, newTriggerTypeVal);
        // If the user selects Delete as the record trigger type, store the existing FlowTriggerType value in a variable which
        // will be defaulted to if the user switches back from Delete to Create, Update, Create Or Update
        if (newTriggerTypeVal === DELETE) {
            this.oldFlowTriggerType = this.startElement.triggerType.value;
            this.handleTypeBeforeDelete();
        } else if (this.startElement.triggerType.value === BEFORE_SAVE || this.oldFlowTriggerType === BEFORE_SAVE) {
            this.handleTypeBeforeSave();
        } else {
            this.handleTypeAfterSave();
        }
        await loadOperatorsAndRulesOnTriggerTypeChange(this.processType, this.triggerType, newTriggerTypeVal);
        this.template.querySelector('builder_platform_interaction-record-filter')?.updateOperatorList();
    };

    /**
     * Handles Trigger Type visual picker list selection in Configure Trigger Modal
     *
     * @param event - visualpickerlistchanged event from visual-picker-list component.
     */
    handleTypeSelection = (event) => {
        const selectedItemId = event.detail.items.find((item) => item.isSelected)?.id;
        if (selectedItemId === BEFORE_SAVE) {
            this.handleTypeBeforeSave();
        } else {
            this.handleTypeAfterSave();
        }
    };

    handleTypeBeforeSave() {
        this._updateField(START_ELEMENT_FIELDS.TRIGGER_TYPE, BEFORE_SAVE);
    }

    handleTypeBeforeDelete() {
        this._updateField(START_ELEMENT_FIELDS.TRIGGER_TYPE, BEFORE_DELETE);
    }

    handleTypeAfterSave() {
        this._updateField(START_ELEMENT_FIELDS.TRIGGER_TYPE, AFTER_SAVE);
    }

    /**
     * @param event - valueChanged event from the custom property editor
     */
    handleValueChanged(event: object) {
        event.stopPropagation();
        this.startElement = recordChangeTriggerReducer(this.startElement, event);
    }

    /**
     * @param event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event: object) {
        event.stopPropagation();
        const { item, error, displayText } = event.detail;
        const oldRecordEntityName = this.recordEntityName;
        const newRecordEntityName = (item && item.value) || displayText;
        this.updateProperty('object', newRecordEntityName, error, false, oldRecordEntityName);
        if (!error && newRecordEntityName) {
            this.recordEntityName = newRecordEntityName;
        }
    }

    /**
     * @param event - property changed event coming from label-description component or the list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(event: object) {
        event.stopPropagation();
        this.startElement = recordChangeTriggerReducer(this.startElement, event);
        this.disableRecordChangeOptionsIndicator = this.hasFilterWithOperator(FlowComparisonOperator.IsChanged);
        if (this.disableRecordChangeOptionsIndicator) {
            this.startElement.doesRequireRecordChangedToMeetCriteria = false;
        }
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }

    /**
     * Instantiates property changed event based to handle property change and updating via element's reducer state accordingly
     *
     * @param propertyName - name of the property changed
     * @param newValue - new value to be passed to property
     * @param error - error on property
     * @param ignoreValidate - true if we do not want to have specific property validation
     * @param oldValue - property's previous value
     */
    updateProperty(
        propertyName: string,
        newValue: object | string | boolean,
        error: string,
        ignoreValidate: boolean,
        oldValue: object | string | boolean
    ) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.startElement = recordChangeTriggerReducer(this.startElement, propChangedEvent);
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }

    get showRequireRecordChangeOptions() {
        const conditionLogic = this.startElement.filterLogic;
        return (
            this.triggerHasCriteria &&
            this.triggerType &&
            (this.triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE || this.triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE) &&
            this.saveType &&
            (this.saveType === FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE ||
                this.saveType === FLOW_TRIGGER_SAVE_TYPE.UPDATE) &&
            conditionLogic &&
            conditionLogic.value !== CONDITION_LOGIC.NO_CONDITIONS
        );
    }

    get requireRecordChangeOptions() {
        return requireRecordChangeOptions();
    }

    handleRequireRecordChangeOptionOnChange(event) {
        event.stopPropagation();
        const oldRRCMC = this.requireRecordChangeOption !== EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;
        const doesRequireRecordChangedToMeetCriteria =
            event.detail.value !== EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;
        this.updateProperty(
            'doesRequireRecordChangedToMeetCriteria',
            doesRequireRecordChangedToMeetCriteria,
            null,
            true,
            oldRRCMC
        );
    }

    hasFilterWithOperator(operator: FlowComparisonOperator): boolean {
        const operators = [];
        if (this.startElement.filters != null) {
            this.startElement.filters.forEach((key) => {
                if (key.operator != null && key.operator.value != null) {
                    operators.push(key.operator.value);
                }
            });
        }
        return operators.includes(operator);
    }

    toggleRunOnSuccessScheduledPath(event) {
        event.stopPropagation();
        this._updateField(START_ELEMENT_FIELDS.IS_RUN_ON_SUCCESS_PATH_ENABLED, event.detail.checked);
    }

    connectedCallback() {
        loadOperatorsAndRulesOnTriggerTypeChange(
            this.processType,
            this.triggerType,
            this.startElement.recordTriggerType.value
        );
    }
}
