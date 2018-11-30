import { LightningElement, api, track } from 'lwc';
import { recordLookupReducer } from "./recordLookupReducer";
import { ENTITY_TYPE, fetchFieldsForEntity, getAllEntities } from "builder_platform_interaction/sobjectLib";
import { LABELS } from "./recordLookupEditorLabels";
import { getOutputRules } from "builder_platform_interaction/ruleLib";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import { format } from 'builder_platform_interaction/commonUtils';

const OUTPUT_ICON = 'utility:forward';

export default class RecordLookupEditor extends LightningElement {
    labels = LABELS;

    outputRules = getOutputRules();

    /**
     * Internal state for the editor
     */
    @track
    state = {
        recordLookupElement: {},
        recordEntityName: '',
        wayToStoreFields: '',
        resourceDisplayText: '',
        fields: {},
    }

    sObjectName = '';

    crudFilterType = ENTITY_TYPE.QUERYABLE

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.state.recordLookupElement;
    }

    @api
    get node() {
        return this.state.recordLookupElement;
    }

    set node(newValue) {
        this.state.recordLookupElement = newValue;
        this.state.recordEntityName = this.state.recordLookupElement.object.value;
        this.state.wayToStoreFields = this.hasOutputAssignemts ? WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES : WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE;
        this.updateFields();
    }

    /**
     * public api function to run the rules from record lookup validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        this.state.recordLookupElement = recordLookupReducer(this.state.recordLookupElement, { type: VALIDATE_ALL,
            wayToStoreFields : this.wayToStoreFieldsValue });
        return getErrorsFromHydratedElement(this.state.recordLookupElement);
    }

    get hasOutputAssignemts() {
        return this.state.recordLookupElement.outputAssignments && this.state.recordLookupElement.outputAssignments.length > 0;
    }

    /**
     * @returns {Object} the entity fields
     */
    get recordFields() {
        return this.state.fields;
    }

    /**
     * Returns the number of result stored.
     * If firstRecord then the user will be able to select a sObject variable
     * If allRecord then the user will be able to select a sObject Collection variable
     * @returns {String} This value can be 'firstRecord' or 'allRecords'
     */
    get numberRecordsToStoreValue() {
        return this.state.recordLookupElement.numberRecordsToStore;
    }

    /**
     * @returns {boolean} true if you want to store all the records to an sObject collection variable
     */
    get isCollection() {
        return this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.ALL_RECORDS;
    }

    /**
     * @returns {String} the sObject or sObject collection variable that you want to assign the records to reference them later
     * outputReference defaulted to '' in factory if undefined, see {@link elementFactory#createRecordLookup}
     */
    get outputReferenceValue() {
        return this.state.recordLookupElement.outputReference.value;
    }

    /**
     * @returns {String} the output reference error message
     */
    get outputReferenceErrorMessage() {
        if (this.state.recordLookupElement.outputReference) {
            return this.state.recordLookupElement.outputReference.error;
        }
        return '';
    }

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object, // Label
            this.labels.objectPlaceholder, // Placeholder
            this.state.recordLookupElement.object.error, // errorMessage
            false, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    get resourceDisplayText() {
        const entityToDisplay = getAllEntities().filter(entity => entity.apiName === this.state.recordEntityName);
        if (entityToDisplay.length === 1) {
            return entityToDisplay[0].entityLabel;
        }
        return '';
    }

    get isSObjectMode() {
        return (this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.FIRST_RECORD && this.state.wayToStoreFields === WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE)
        || (this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.ALL_RECORDS);
    }

    get wayToStoreFieldsValue() {
        return this.state.wayToStoreFields;
    }

    get assignmentTitle() {
        return format(this.labels.lookupAssignmentTitleFormat, this.resourceDisplayText);
    }

    get operatorIconName() {
        return OUTPUT_ICON;
    }

    /**
     * get the fields of the selected entity
     */
    updateFields() {
        this.state.fields = {};
        if (this.state.recordEntityName) {
            fetchFieldsForEntity(this.state.recordEntityName).then(fields => {
                this.state.fields = fields;
            }).catch(() => {
                // fetchFieldsForEntity displays an error message
            });
        }
    }

    /**
     * @param {object} event - property changed event coming from label-description component or the list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(event) {
        event.stopPropagation();
        this.state.recordLookupElement = recordLookupReducer(this.state.recordLookupElement, event);
    }

    /**
     * @param {object} event - sobjectreferencechanged event from sobject-or-sobject-collection component. The property name depends on the record node (create/update/lookup)
     */
    handleSObjectReferenceChanged(event) {
        event.stopPropagation();
        this.updateProperty('outputReference', event.detail.value, event.detail.error, false, this.outputReferenceValue);
    }

    /**
     * @param {object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const oldRecordEntityName = this.state.recordEntityName;
        const {item, error, displayText} = event.detail;
        const value = item ? item.value : displayText;
        if (oldRecordEntityName !== value) {
           this.state.recordEntityName = value;
           if (item) {
             this.updateFields();
           }
        }
        this.updateProperty('object', value, error, false, oldRecordEntityName);
    }

    /**
     * @param {object} event - recordstoreoptionchanged event from record-store-options component.
     */
    handleRecordStoreOptionsChanged(event) {
        event.stopPropagation();
        if (this.numberRecordsToStoreValue !== event.detail.numberRecordsToStore) {
            this.updateProperty('numberRecordsToStore', event.detail.numberRecordsToStore, null, true, this.numberRecordsToStoreValue);
            this.updateProperty('outputReference', '', null, true, this.sObjectName);
        } else if (this.state.recordLookupElement.assignNullValuesIfNoRecordsFound !== event.detail.assignNullToVariableNoRecord) {
            this.updateProperty('assignNullValuesIfNoRecordsFound', event.detail.assignNullToVariableNoRecord, null, false);
        } else if (this.state.wayToStoreFields !== event.detail.wayToStoreFields) {
            // reset outputAssignments
            this.updateProperty('wayToStoreFields', '', null, true);
            this.state.wayToStoreFields = event.detail.wayToStoreFields;
        }
    }

    /**
     * @param {object} event - change event from record-sort component.
     */
    handleRecordSortChanged(event) {
        event.stopPropagation();
        if (this.state.recordLookupElement.sortField.value !== event.detail.fieldApiName) {
            this.updateProperty('sortField', event.detail.fieldApiName, event.detail.error, false);
        } else {
            // Can't have error on this field, all errors are related to sortFields
            this.updateProperty('sortOrder', event.detail.sortOrder, null, false);
        }
    }

    handleFilterTypeChanged(event) {
        event.stopPropagation();
        this.updateProperty('filterType', event.detail.filterType, event.detail.error, false);
    }

    handleRecordInputOutputAssignmentsChanged(event) {
        event.stopPropagation();
        this.state.recordLookupElement = recordLookupReducer(this.state.recordLookupElement, event);
    }

    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.state.recordLookupElement = recordLookupReducer(this.state.recordLookupElement, propChangedEvent);
    }
}