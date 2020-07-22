// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { fetchFieldsForEntity, getEntity, ENTITY_TYPE } from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './contextRecordEditorLabels';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    ELEMENT_TYPE,
    FLOW_TRIGGER_TYPE,
    EXECUTE_OUTCOME_WHEN_OPTION_VALUES,
    CONDITION_LOGIC
} from 'builder_platform_interaction/flowMetadata';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import { contextReducer } from './contextRecordReducer';
import {
    isScheduledTriggerType,
    getTriggerTypeInfo,
    getTriggerHasCriteria,
    isRecordChangeTriggerType
} from 'builder_platform_interaction/triggerTypeLib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { requireRecordChangeOptions } from './contextRecordEditorLabels';
import { isExecuteOnlyWhenChangeMatchesConditionsPossible } from 'builder_platform_interaction/storeUtils';

const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE, SCHEDULED, SCHEDULED_JOURNEY } = FLOW_TRIGGER_TYPE;

export default class contextRecordEditor extends LightningElement {
    @track requireRecordChangeOption = EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;

    /**
     * Internal state for the record change trigger editor
     */
    @track
    startElement;

    @track
    fields;

    @track
    configurationEditor;

    labels = LABELS;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    @api
    editorParams;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        this.startElement = newValue || {};
        this.requireRecordChangeOption = this.startElement.doesRequireRecordChangedToMeetCriteria
            ? EXECUTE_OUTCOME_WHEN_OPTION_VALUES.ONLY_WHEN_CHANGES_MEET_CONDITIONS
            : EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.startElement;
    }

    connectedCallback() {
        if (this.triggerType && this.triggerType !== FLOW_TRIGGER_TYPE.NONE) {
            // Get the current trigger type info and set the custom property editor info if one is defined,
            // else, load fields for the selected context object
            getTriggerTypeInfo(this.triggerType).then(data => {
                if (data && data.configurationEditor) {
                    this.configurationEditor = { name: data.configurationEditor };
                } else {
                    this.updateFields();
                }
            });
        }
    }

    get triggerType() {
        return this.startElement.triggerType.value;
    }

    get elementType() {
        if (isRecordChangeTriggerType(this.triggerType)) {
            return ELEMENT_TYPE.START_ON_DML;
        }
        return ELEMENT_TYPE.START_ELEMENT;
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
     * @param {string} newValue - new entity name
     */
    set recordEntityName(newValue) {
        this.startElement.object.value = newValue;
        this.updateFields();
    }

    /**
     * @returns {string} entity name (object)
     */
    get recordEntityName() {
        return this.startElement.object.value;
    }

    /**
     * @returns {string} entity label if any  found for current selected entity empty string otherwise
     */
    get resourceDisplayText() {
        const entityToDisplay = getEntity(this.recordEntityName);
        return entityToDisplay ? entityToDisplay.entityLabel : '';
    }

    /**
     * @returns {Object} the entity fields
     */
    get recordFields() {
        return this.fields;
    }

    /**
     * update the fields of the selected entity
     */
    updateFields() {
        this.fields = {};
        if (this.recordEntityName) {
            fetchFieldsForEntity(this.recordEntityName)
                .then(fields => {
                    this.fields = fields;
                })
                .catch(() => {
                    // fetchFieldsForEntity displays an error message
                });
        }
    }

    /**
     * @returns {Object} configuration to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
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
     * @returns {Object} configuration to pass to entity-resource-picker component. This is a required field
     */
    get entityComboboxConfigRequired() {
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
     * @returns {Boolean} whether the current triggr type supports a custom property editor for context selection (eg. Journey Builder)
     */
    get hasConfigurationEditor() {
        return !!this.configurationEditor;
    }

    /**
     * @returns {Array} values to pass in to the custom property editor
     */
    get configurationEditorValues() {
        return [
            {
                name: 'objectContainer',
                value: this.startElement.objectContainer && this.startElement.objectContainer.value
            }
        ];
    }

    /**
     * @param {Object} event - valueChanged event from the custom property editor
     */
    handleValueChanged(event) {
        event.stopPropagation();
        this.startElement = contextReducer(this.startElement, event);
    }

    /**
     * @param {Object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const { item, error, displayText } = event.detail;
        const oldRecordEntityName = this.recordEntityName;
        const newRecordEntityName = (item && item.value) || displayText;
        if (newRecordEntityName !== oldRecordEntityName) {
            this.updateProperty('object', newRecordEntityName, error, false, oldRecordEntityName);
            if (!error && newRecordEntityName) {
                this.recordEntityName = newRecordEntityName;
            }
        }
    }

    /**
     * @param {Object} event - property changed event coming from label-description component or the list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(event) {
        event.stopPropagation();
        this.startElement = contextReducer(this.startElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }

    /**
     * Instantiates property changed event based to handle property change and updating via element's reducer state accordingly
     * @param {string} propertyName - name of the property changed
     * @param {Object|string|boolean} newValue - new value to be passed to property
     * @param {string} error - error on property
     * @param {boolean} ignoreValidate - true if we do not want to have specific property validation
     * @param {Object|string|boolean} oldValue - property's previous value
     */
    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.startElement = contextReducer(this.startElement, propChangedEvent);
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }

    /**
     * public api function to run the rules from context record validation library, and run the validate function on the custom property editor (if one is rendered)
     * @returns {Array} list of errors
     */
    @api
    validate() {
        const event = { type: VALIDATE_ALL };
        this.startElement = contextReducer(this.startElement, event);
        let errors = getErrorsFromHydratedElement(this.startElement);

        if (this.configurationEditor) {
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

    get showRequireRecordChangeOptions() {
        const conditionLogic = this.startElement.filterLogic;
        return (
            this.triggerHasCriteria &&
            isExecuteOnlyWhenChangeMatchesConditionsPossible() &&
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
        this.requireRecordChangeOption = event.detail.value;
        const doesRequireRecordChangedToMeetCriteria =
            this.requireRecordChangeOption !== EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;
        this.updateProperty(
            'doesRequireRecordChangedToMeetCriteria',
            doesRequireRecordChangedToMeetCriteria,
            null,
            true,
            oldRRCMC
        );
    }
}
