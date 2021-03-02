// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { recordUpdateReducer } from './recordUpdateReducer';
import { LABELS } from './recordUpdateEditorLabels';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { ENTITY_TYPE, fetchFieldsForEntity, getUpdateableEntities } from 'builder_platform_interaction/sobjectLib';
import { format } from 'builder_platform_interaction/commonUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { getTriggerType, getStartObject } from 'builder_platform_interaction/storeUtils';
import {
    CONDITION_LOGIC,
    FLOW_TRIGGER_TYPE,
    RECORD_UPDATE_WAY_TO_FIND_RECORDS
} from 'builder_platform_interaction/flowMetadata';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import { UPDATEABLE_FILTER } from 'builder_platform_interaction/selectors';

export default class RecordUpdateEditor extends LightningElement {
    labels = LABELS;
    sobjectCollectionCriterion = SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION;
    crudFilter = UPDATEABLE_FILTER;

    @track
    state = {
        recordUpdateElement: {},
        entityFields: {}
    };

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    editorParams;

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.state.recordUpdateElement;
    }

    @api
    get node() {
        return this.state.recordUpdateElement;
    }

    set node(newValue) {
        this.state.recordUpdateElement = newValue;
        this.updateFields(this.recordEntityName);
    }

    /**
     * public api function to run the rules from record update validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, event);
        return getErrorsFromHydratedElement(this.state.recordUpdateElement);
    }

    get assignmentTitle() {
        let nounType = this.labels.recordPluralLabel;
        if (this.isTriggeringRecord) {
            nounType = this.labels.recordSingularLabel;
        }
        return format(this.labels.setFieldValuesForTheRecordsFormat, this.resourceDisplayText, nounType);
    }

    get recordFieldsToFilter() {
        return Object.keys(this.state.entityFields)
            .filter((key) => this.state.entityFields[key].filterable)
            .reduce((obj, key) => {
                obj[key] = this.state.entityFields[key];
                return obj;
            }, {});
    }

    get recordFieldsToUpdate() {
        return Object.keys(this.state.entityFields)
            .filter((key) => this.state.entityFields[key].editable)
            .reduce((obj, key) => {
                obj[key] = this.state.entityFields[key];
                return obj;
            }, {});
    }

    get recordFilterOptions() {
        let noCriteria = format(LABELS.filterNoCriteriaUpdate, this.recordEntityName);
        if (this.isTriggeringRecord) {
            noCriteria = LABELS.filterNoCriteriaUpdateTriggering;
        }

        return [
            {
                value: CONDITION_LOGIC.NO_CONDITIONS,
                label: noCriteria
            },
            {
                value: CONDITION_LOGIC.AND,
                label: LABELS.andConditionLogicLabel
            },
            {
                value: CONDITION_LOGIC.OR,
                label: LABELS.orConditionLogicLabel
            },
            {
                value: CONDITION_LOGIC.CUSTOM_LOGIC,
                label: LABELS.customConditionLogicLabel
            }
        ];
    }

    get showWarningMessage(): boolean {
        return !this.isTriggeringRecord;
    }

    get wayToFindRecordOptions() {
        const opts = [
            {
                label: LABELS.idsStoredSObjectOrSObjectCollectionLabel,
                value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE
            },
            {
                label: LABELS.usingCriteriaLabel,
                value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP
            }
        ];

        // add triggering record option only if its record change trigger and object on start is set
        const triggerType: string | undefined = getTriggerType();
        if (triggerType && isRecordChangeTriggerType(triggerType) && this.dollarRecordName()) {
            return [
                {
                    label: format(LABELS.triggeringRecordLabel, this.dollarRecordName().toLowerCase()),
                    value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD
                },
                ...opts
            ];
        }
        return opts;
    }

    get showWayToFindInfoMessage() {
        const triggerType: string | undefined = getTriggerType();
        return triggerType && triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE;
    }

    get recordFilterTitle() {
        return this.isTriggeringRecord ? this.labels.findRecordsLabel : undefined;
    }

    /**
     * used to disable radio wayToFindRecords radio group.
     */
    get isDisabled(): boolean {
        const triggerType = getTriggerType();
        return triggerType && triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE;
    }

    get isSobjectReference(): boolean {
        return (
            getValueFromHydratedItem(this.state.recordUpdateElement.wayToFindRecords) ===
            RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE
        );
    }

    get isRecordLookup(): boolean {
        return (
            getValueFromHydratedItem(this.state.recordUpdateElement.wayToFindRecords) ===
            RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP
        );
    }

    get isTriggeringRecord(): boolean {
        return (
            getValueFromHydratedItem(this.state.recordUpdateElement.wayToFindRecords) ===
            RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD
        );
    }

    get objectName(): string {
        return getValueFromHydratedItem(this.state.recordUpdateElement.object);
    }

    get showConditionsAndAssignments(): boolean {
        return this.isTriggeringRecord || (this.isRecordLookup && this.objectName !== '');
    }

    get recordEntityName(): string {
        return this.isTriggeringRecord ? this.dollarRecordName() : this.objectName;
    }

    get showSobjectLookup() {
        return this.state.recordUpdateElement.useSobject && !this.state.recordUpdateElement.isTriggeringRecord;
    }

    get showSpecifyConditions() {
        return !this.state.recordUpdateElement.useSobject;
    }

    get inputReference() {
        if (
            this.state.recordUpdateElement.inputReference &&
            getValueFromHydratedItem(this.state.recordUpdateElement.inputReference)
        ) {
            return getValueFromHydratedItem(this.state.recordUpdateElement.inputReference);
        }
        return '';
    }

    get crudFilterType() {
        return ENTITY_TYPE.UPDATABLE;
    }

    get resourceDisplayText() {
        const entityToDisplay = getUpdateableEntities().find((entity) => entity.apiName === this.recordEntityName);
        if (entityToDisplay) {
            return entityToDisplay.entityLabel;
        }
        return '';
    }

    /**
     * Returns the option selected for RECORD_UPDATE_WAY_TO_FIND_RECORDS
     * @returns {String} derived from enum RECORD_UPDATE_WAY_TO_FIND_RECORDS
     */
    get wayToFindRecordsValue(): string {
        return getValueFromHydratedItem(this.state.recordUpdateElement.wayToFindRecords);
    }

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object,
            this.labels.objectPlaceholder,
            this.state.recordUpdateElement.object.error,
            false,
            true,
            false,
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
     * get the fields of the selected entity
     */
    updateFields(recordEntityName) {
        this.state.entityFields = {};
        if (recordEntityName) {
            fetchFieldsForEntity(recordEntityName)
                .then((fields) => {
                    this.state.entityFields = fields;
                })
                .catch(() => {
                    // fetchFieldsForEntity displays an error message
                });
        }
    }

    /**
     * type of triggering record, usually stored in Start element
     */
    dollarRecordName(): string {
        return getStartObject() || '';
    }

    /**
     * @param {object} event - input reference changed event coming from sobject-or-sobject-collection-picker component
     */
    handleInputReferenceChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty('inputReference', event.detail.value, event.detail.error);
    }

    handleWayToFindOptionChanged(event) {
        event.stopPropagation();
        this.updateProperty('wayToFindRecords', event.detail.value, event.detail.error);

        if (event.detail.value === RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD) {
            this.updateFields(this.recordEntityName);
        }
    }

    /**
     * @param {object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const oldRecordEntityName = this.state.recordUpdateElement.object;
        const newRecordEntityName = event.detail.item ? event.detail.item.value : '';

        if (newRecordEntityName !== oldRecordEntityName) {
            this.updateProperty('object', newRecordEntityName, event.detail.error, false, oldRecordEntityName);
            this.updateFields(newRecordEntityName);
        }
    }

    /**
     * @param {object} event - property changed event coming from label-description component or the list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(event) {
        event.stopPropagation();
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, event);
    }

    handleRecordInputOutputAssignmentsChanged(event) {
        event.stopPropagation();
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, event);
    }

    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, propChangedEvent);
    }
}
