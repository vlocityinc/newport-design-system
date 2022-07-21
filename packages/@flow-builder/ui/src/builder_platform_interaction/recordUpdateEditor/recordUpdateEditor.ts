// @ts-nocheck
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import {
    CONDITION_LOGIC,
    FLOW_TRIGGER_TYPE,
    RECORD_UPDATE_WAY_TO_FIND_RECORDS
} from 'builder_platform_interaction/flowMetadata';
import { resolveReferenceFromIdentifier } from 'builder_platform_interaction/mergeFieldLib';
import { UPDATEABLE_FILTER } from 'builder_platform_interaction/selectors';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import {
    ENTITY_TYPE,
    fetchFieldsForEntity,
    fetchRelatedRecordFieldsForEntity,
    getEntity,
    getUpdateableEntities
} from 'builder_platform_interaction/sobjectLib';
import { getStartObject, getTriggerType } from 'builder_platform_interaction/storeUtils';
import { doesSupportTriggeringRecordUpdate } from 'builder_platform_interaction/triggerTypeLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './recordUpdateEditorLabels';
import { recordUpdateReducer } from './recordUpdateReducer';
const { format } = commonUtils;
export default class RecordUpdateEditor extends LightningElement {
    labels = LABELS;
    sobjectCollectionCriterion = SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION;
    crudFilter = UPDATEABLE_FILTER;

    @track
    state = {
        recordUpdateElement: {},
        entityFields: {},
        entityRelatedFields: {},
        relatedRecordFieldSubType: ''
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
        if (this.wayToFindRecordsValue === RECORD_UPDATE_WAY_TO_FIND_RECORDS.RELATED_RECORD_LOOKUP) {
            this.getRecordRelatedFieldsAndUpdateFields();
        } else {
            this.updateFields(this.recordEntityName);
        }
    }

    /**
     * public api function to run the rules from record update validation library
     *
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
        const noCriteria = this.isTriggeringRecord
            ? LABELS.filterNoCriteriaUpdateTriggering
            : this.isRelatedRecordLookup
            ? LABELS.filterNoCriteriaUpdateRelatedRecord
            : format(LABELS.filterNoCriteriaUpdate, this.recordEntityName);

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

    get showWarningMessage() {
        return !this.isTriggeringOrRelatedRecord;
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
        const triggerType = getTriggerType();
        if (doesSupportTriggeringRecordUpdate(triggerType) && this.dollarRecordName()) {
            const label =
                triggerType === FLOW_TRIGGER_TYPE.SCHEDULED
                    ? LABELS.triggeringScheduledRecordLabel
                    : LABELS.triggeringRecordLabel;
            return [
                {
                    label: this.formatWithEntityLabel(label),
                    value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD
                },
                {
                    label: this.formatWithEntityLabel(LABELS.updateRecordsRelatedToTriggeredFlow),
                    value: RECORD_UPDATE_WAY_TO_FIND_RECORDS.RELATED_RECORD_LOOKUP
                },
                ...opts
            ];
        }
        return opts;
    }

    get showWayToFindInfoMessage() {
        return getTriggerType() === FLOW_TRIGGER_TYPE.BEFORE_SAVE;
    }

    get recordFilterTitle() {
        return this.isTriggeringOrRelatedRecord ? this.labels.findRecordsLabel : undefined;
    }

    /**
     * used to disable radio wayToFindRecords radio group.
     *
     * @returns {boolean} isDisable - True if triggerType is Before save.
     */
    get isDisabled(): boolean {
        return getTriggerType() === FLOW_TRIGGER_TYPE.BEFORE_SAVE;
    }

    get isSobjectReference(): boolean {
        return this.wayToFindRecordsValue === RECORD_UPDATE_WAY_TO_FIND_RECORDS.SOBJECT_REFERENCE;
    }

    get isRecordLookup(): boolean {
        return this.wayToFindRecordsValue === RECORD_UPDATE_WAY_TO_FIND_RECORDS.RECORD_LOOKUP;
    }

    get isTriggeringRecord(): boolean {
        return this.wayToFindRecordsValue === RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD;
    }

    get isRelatedRecordLookup() {
        return this.wayToFindRecordsValue === RECORD_UPDATE_WAY_TO_FIND_RECORDS.RELATED_RECORD_LOOKUP;
    }

    get objectName(): string {
        return getValueFromHydratedItem(this.state.recordUpdateElement.object);
    }

    get showConditionsAndAssignments(): boolean {
        return (
            this.isTriggeringOrRelatedRecord ||
            (this.isRecordLookup && this.objectName !== '') ||
            (this.isRelatedRecordLookUp && this.objectName !== '')
        );
    }

    get showSobjectPicker(): boolean {
        return this.isRelatedRecordLookup || this.isSobjectReference;
    }

    get recordEntityName(): string {
        return this.isTriggeringOrRelatedRecord ? this.dollarRecordName() : this.objectName;
    }

    get isTriggeringOrRelatedRecord(): boolean {
        return this.isTriggeringRecord || this.isRelatedRecordLookup;
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

    get filterCriteriaRelatedRecordsLabel() {
        return format(LABELS.filterCriteriaRelatedRecords, this.entityLabel);
    }

    get sObjectPickerHeader() {
        return this.isRelatedRecordLookup ? LABELS.selectRelatedRecords : LABELS.selectRecordsToUpdate;
    }

    get sObjectPickerLabel() {
        return this.isRelatedRecordLookup
            ? this.filterCriteriaRelatedRecordsLabel
            : LABELS.recordVariableOrRecordCollectionVariable;
    }

    get sObjectPickerPlaceholder() {
        return this.isRelatedRecordLookup ? LABELS.relatedRecordFieldsPickerPlaceholder : LABELS.searchRecords;
    }

    get entityLabel() {
        return getEntity(this.dollarRecordName())?.entityLabel ?? '';
    }

    get relatedRecordFieldsPickerHelpText() {
        return this.recordEntityName && this.state.relatedRecordFieldSubType
            ? format(LABELS.relatedRecordFieldsPickerHelpText, this.state.relatedRecordFieldSubType, this.entityLabel)
            : '';
    }

    /**
     * Returns the option selected for RECORD_UPDATE_WAY_TO_FIND_RECORDS
     *
     * @returns {string} derived from enum RECORD_UPDATE_WAY_TO_FIND_RECORDS
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
     *
     * @param recordEntityName - selected Entity name
     */
    updateFields(recordEntityName: string) {
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
     * get the related fields of the selected entity
     *
     * @param recordEntityName - selected entity name
     */
    updateRelatedFields(recordEntityName: string) {
        this.state.entityRelatedFields = {};
        fetchRelatedRecordFieldsForEntity(recordEntityName)
            .then((fields) => {
                this.state.entityRelatedFields = fields;
            })
            .catch(() => {
                // fetchRelatedRecordFieldsForEntity displays an error message
            });
    }

    /**
     *  get the related record field entity type and update fields
     */
    getRecordRelatedFieldsAndUpdateFields = async () => {
        const fields = await resolveReferenceFromIdentifier(this.inputReference, true);
        if (fields) {
            const { apiName, isCustom, isPolymorphic, isRelatedRecordChild, sobjectName } = fields.pop();
            let leafRecordName;
            if (isRelatedRecordChild) {
                leafRecordName = sobjectName;
            } else if (isCustom) {
                leafRecordName = apiName;
            } else if (isPolymorphic) {
                leafRecordName = this.inputReference.split(':').slice(-1);
            }
            this.state.relatedRecordFieldSubType = leafRecordName;
            this.updateFields(leafRecordName);
        } else {
            this.state.entityFields = {};
        }
    };

    /**
     * type of triggering record, usually stored in Start element
     *
     * @returns the object type for the current flow.
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

    /**
     * Updates the property inputReference with the selected related fields.
     * Then get the relatedFields sobjectName from the entityRelatedFields array and
     * update the fields needed for the filter and assignment.
     *
     * @param {object} event - related fields changed event coming from related-fields-picker component
     */
    handleRelatedRecordFieldsChangedEvent(event: UpdateRelatedRecordFieldsChangeEvent) {
        event.stopPropagation();
        this.updateProperty('inputReference', event.detail.value, event.detail.error);
        this.state.relatedRecordFieldSubType = event.detail?.subType;
        this.updateFields(this.state.relatedRecordFieldSubType);
    }

    handleWayToFindOptionChanged(event) {
        event.stopPropagation();
        this.updateProperty('wayToFindRecords', event.detail.value, event.detail.error);

        if (event.detail.value === RECORD_UPDATE_WAY_TO_FIND_RECORDS.TRIGGERING_RECORD) {
            this.updateFields(this.recordEntityName);
        } else if (event.detail.value === RECORD_UPDATE_WAY_TO_FIND_RECORDS.RELATED_RECORD_LOOKUP) {
            this.updateRelatedFields(this.recordEntityName);
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

    handleFetchMenuData(event) {
        const subType = event.detail.item?.subtype;
        if (subType) {
            this.updateRelatedFields(subType);
        }
    }

    formatWithEntityLabel(label: string) {
        return format(label, this.entityLabel.toLowerCase());
    }
}
