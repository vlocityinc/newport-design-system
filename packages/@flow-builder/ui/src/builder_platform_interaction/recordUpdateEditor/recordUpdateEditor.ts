import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import type {
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    SObjectReferenceChangedEvent,
    UpdateRecordFilterEvent,
    UpdateRelatedRecordFieldsChangeEvent
} from 'builder_platform_interaction/events';
import { ComboboxStateChangedEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import {
    CONDITION_LOGIC,
    FLOW_TRIGGER_TYPE,
    RECORD_UPDATE_WAY_TO_FIND_RECORDS
} from 'builder_platform_interaction/flowMetadata';
import { resolveReferenceFromIdentifier } from 'builder_platform_interaction/mergeFieldLib';
import { getRelatedRecordName } from 'builder_platform_interaction/relatedRecordLib';
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

type HydratedExpression = {
    leftHandSide: UI.HydratedValue;
    leftHandSideDataType: UI.HydratedValue;
    rightHandSide: UI.HydratedValue;
    rightHandSideDataType: UI.HydratedValue;
};

type RecordUpdateState = {
    recordUpdateElement: {
        object?: UI.HydratedValue;
        inputReference?: UI.HydratedValue;
        wayToFindRecords?: UI.HydratedValue;
        filterLogic?: UI.HydratedValue;
        inputAssignments?: HydratedExpression[];
        filters?: HydratedExpression[];
    };
    entityFields: {};
    entityRelatedFields: {};
    relatedRecordFieldSubType: string;
};

export default class RecordUpdateEditor extends LightningElement {
    labels = LABELS;
    sobjectCollectionCriterion = SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION;
    crudFilter = UPDATEABLE_FILTER;

    @track
    state: RecordUpdateState = {
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

    /**
     * Display or not the field filters and assignments sections
     *
     * @returns true if valid related record or triggered record or object selected, otherwise false
     */
    get showConditionsAndAssignments() {
        return (
            (this.isRelatedRecordLookup && this.hasValidRelatedRecord) ||
            this.isTriggeringRecord ||
            (this.isRecordLookup && this.objectName !== '')
        );
    }

    /**
     * Display or not the related record helpText
     *
     * @returns true if to be displayed, false otherwise
     */
    get showRelatedRecordHelpText() {
        return this.isRelatedRecordLookup && this.hasValidRelatedRecord;
    }

    get showSobjectPicker(): boolean {
        return this.isRelatedRecordLookup || this.isSobjectReference;
    }

    get recordEntityName(): string {
        return this.isTriggeringOrRelatedRecord ? this.dollarRecordName() : this.objectName;
    }

    get recordEntityNameForConditionsAndAssignments(): string {
        return this.isRelatedRecordLookup ? this.state.relatedRecordFieldSubType : this.recordEntityName;
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
        const entityToDisplay = getUpdateableEntities().find(
            (entity) => entity.apiName === this.recordEntityNameForConditionsAndAssignments
        );
        return entityToDisplay ? entityToDisplay.entityLabel : '';
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
            this.state.recordUpdateElement.object?.error,
            false,
            true,
            false,
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
     * is related record current value valid?
     *
     * @returns true if valid otherwise false
     */
    get hasValidRelatedRecord() {
        return !!this.state.relatedRecordFieldSubType && !this.state.recordUpdateElement?.inputReference?.error;
    }

    /**
     * get the fields of the selected entity
     *
     * @param recordEntityName - selected Entity name
     */
    updateFields(recordEntityName: string | null) {
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
     * Update the related fields based on the selected related record
     *
     * @param recordEntityName - selected related record (ie: entity name)
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
     *  get the related record field entity type and update related fields
     */
    getRecordRelatedFieldsAndUpdateFields = async () => {
        const fields = await resolveReferenceFromIdentifier(this.inputReference, true);
        if (fields) {
            const relatedRecordName = getRelatedRecordName(fields.pop() as Metadata.Field, this.inputReference);
            this.state.relatedRecordFieldSubType = relatedRecordName;
            this.updateFields(relatedRecordName);
        } else {
            this.state.entityFields = {};
        }
    };

    /**
     * Get the type of triggering record (fetched from the Start element, eg: Account)
     *
     * @returns the object type of the current start element if any or an empty string if none found.
     */
    dollarRecordName() {
        return getStartObject() || '';
    }

    /**
     * Handle change of input reference from the {@link SObjectOrSObjectCollectionPicker} component
     *
     * @param event SObjectReferenceChangedEvent
     */
    handleInputReferenceChangedEvent(event: SObjectReferenceChangedEvent) {
        event.stopPropagation();
        const oldInputReference: string = getValueFromHydratedItem(this.state.recordUpdateElement.inputReference);
        const newInputReference = event.detail.value;
        if (oldInputReference !== newInputReference) {
            this.updateProperty('inputReference', newInputReference, event.detail.error, oldInputReference);
        }
    }

    /**
     * Handle input reference in related record mode
     * Updates the property inputReference with the selected related record.
     * Then get the related fields sobjectName from the entityRelatedFields array and
     * update the fields needed for the filter and assignment.
     *
     * @param event - related fields changed event coming from {@link RelatedRecordFieldsPicker} component
     */
    handleRelatedRecordFieldsChangedEvent(event: UpdateRelatedRecordFieldsChangeEvent) {
        event.stopPropagation();
        const oldInputReferenceFromRelatedRecord: string = getValueFromHydratedItem(
            this.state.recordUpdateElement.inputReference
        );
        const newInputReferenceFromRelatedRecord = event.detail.value;
        if (oldInputReferenceFromRelatedRecord !== newInputReferenceFromRelatedRecord) {
            this.updateProperty(
                'inputReference',
                newInputReferenceFromRelatedRecord,
                event.detail.error,
                oldInputReferenceFromRelatedRecord
            );
            this.state.relatedRecordFieldSubType = event.detail?.subType || '';
            this.updateFields(this.state.relatedRecordFieldSubType);
        }
    }

    /**
     * Handle change of way to select the record(s) to update
     *
     * @param event changer event coming from options to fetch record(s) to update radio group
     */
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
     * Handle change of object
     *
     * @param event event from {@link EntityResourcePicker} component.
     */
    handleResourceChanged(event: ComboboxStateChangedEvent) {
        event.stopPropagation();
        const oldRecordEntityName = getValueFromHydratedItem(this.state.recordUpdateElement.object);
        const newRecordEntityName = event.detail.item ? event.detail.item.value : '';
        if (newRecordEntityName !== oldRecordEntityName) {
            this.updateProperty('object', newRecordEntityName, event.detail.error, oldRecordEntityName, false);
            this.updateFields(newRecordEntityName);
        }
    }

    /**
     * @param event - property changed event coming from {@link LabelDescription} component or the record filters list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(
        event: AddRecordFilterEvent | UpdateRecordFilterEvent | DeleteRecordFilterEvent | PropertyChangedEvent
    ) {
        event.stopPropagation();
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, event);
    }

    handleRecordInputOutputAssignmentsChanged(event) {
        event.stopPropagation();
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, event);
    }

    updateProperty(
        propertyName: string,
        newValue: string | null,
        error?: string | null,
        oldValue?: string,
        ignoreValidate?: boolean
    ) {
        const propChangedEvent = new PropertyChangedEvent(
            propertyName,
            newValue,
            error,
            null,
            oldValue,
            undefined,
            undefined,
            ignoreValidate
        );
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
