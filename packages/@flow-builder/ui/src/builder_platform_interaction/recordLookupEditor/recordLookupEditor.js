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
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export default class RecordLookupEditor extends LightningElement {
    labels = LABELS;

    outputRules = getOutputRules();

    /**
     * Internal state for the editor
     */
    @track
    state = {
        recordLookupElement: {},
        wayToStoreFields: '',
        fields: {},
    }

    /**
     * only queryable entities available
     */
    crudFilterType = ENTITY_TYPE.QUERYABLE

    /**
     * element type of the current editor
     */
    elementType = ELEMENT_TYPE.RECORD_LOOKUP;

    /**
     * output assignment operator icon name (output icon)
     */
    operatorIconName = 'utility:forward';

    /**
     * public API function to return the node
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
        this.state.wayToStoreFields = this.hasOutputAssignemts ? WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES : WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE;
        this.updateFields();
    }

    /**
     * public API function to run the rules from record lookup validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        this.state.recordLookupElement = recordLookupReducer(this.state.recordLookupElement, { type: VALIDATE_ALL,
            wayToStoreFields : this.wayToStoreFieldsValue });
        return getErrorsFromHydratedElement(this.state.recordLookupElement);
    }

    /**
     * set the entity name (object) and load fields accordingly
     * @param {string} newValue - new entity name
     */
    set recordEntityName(newValue) {
        this.state.recordLookupElement.object.value = newValue;
        this.updateFields();
    }

    /**
     * @returns {string} entity name (object)
     */
    get recordEntityName() {
        return this.state.recordLookupElement.object.value;
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
     * {@link recordEditorLib#NUMBER_RECORDS_TO_STORE}
     * @returns {string} This value can be 'firstRecord' or 'allRecords'
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
     * @returns {string} the sObject or sObject collection variable that you want to assign the records to reference them later
     * outputReference defaulted to '' in factory if undefined, see {@link elementFactory#createRecordLookup}
     */
    get outputReferenceValue() {
        return this.state.recordLookupElement.outputReference.value;
    }

    /**
     * @returns {string} the output reference error message
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

    /**
     * @returns {string} entity label if any found for current selected entity empty string otherwise
     */
    get resourceDisplayText() {
        const entityToDisplay = getAllEntities().find(entity => entity.apiName === this.recordEntityName);
        return entityToDisplay ? entityToDisplay.entityLabel : '';
    }

    /**
     * @returns {boolean} true if record lookup element in sobject mode false otherwise
     */
    get isSObjectMode() {
        return (this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.FIRST_RECORD && this.state.wayToStoreFields === WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE)
        || (this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.ALL_RECORDS);
    }

    /**
     * Returns the way to store: sobject variable or separate variables
     * If "sObjectVariable" then the user will be able to store in an sObject variable
     * If "separateVariables" then the user will be able to store in separate variables
     * see {@link recordEditorLib#WAY_TO_STORE_FIELDS}
     * @returns {string} This value can be 'sObjectVariable' or 'separateVariables'
     */
    get wayToStoreFieldsValue() {
        return this.state.wayToStoreFields;
    }

    /**
     * @returns {string} dynamic output assignment title (based on current entity label)
     */
    get assignmentTitle() {
        return format(this.labels.lookupAssignmentTitleFormat, this.resourceDisplayText);
    }

    /**
     * @returns {boolean} true if valid entity name selected/typed
     */
    get hasValidRecordEntityName() {
        return this.recordEntityName && !this.state.recordLookupElement.object.error;
    }

    /**
     * update the fields of the selected entity
     */
    updateFields() {
        this.state.fields = {};
        if (this.hasValidRecordEntityName) {
            fetchFieldsForEntity(this.recordEntityName).then(fields => {
                this.state.fields = fields;
            }).catch(() => {
                // fetchFieldsForEntity displays an error message
            });
        }
    }

    /**
     * @param {Object} event - property changed event coming from label-description component or the list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(event) {
        event.stopPropagation();
        this.state.recordLookupElement = recordLookupReducer(this.state.recordLookupElement, event);
    }

    /**
     * @param {Object} event - sobjectreferencechanged event from sobject-or-sobject-collection component. The property name depends on the record node (create/update/lookup)
     */
    handleSObjectReferenceChanged(event) {
        event.stopPropagation();
        this.updateProperty('outputReference', event.detail.value, event.detail.error, false, this.outputReferenceValue);
    }

    /**
     * @param {Object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const {item, error, displayText} = event.detail;
        const oldRecordEntityName = this.recordEntityName;
        const newRecordEntityName = (item && item.value) || displayText;
        if (newRecordEntityName !== oldRecordEntityName) {
            this.updateProperty('object', newRecordEntityName, error, false, oldRecordEntityName);
            this.recordEntityName = newRecordEntityName;
        }
    }

    /**
     * @param {Object} event - recordstoreoptionchanged event from record-store-options component.
     */
    handleRecordStoreOptionsChanged(event) {
        event.stopPropagation();
        const {numberRecordsToStore, assignNullToVariableNoRecord, wayToStoreFields} = event.detail;
        if (this.numberRecordsToStoreValue !== numberRecordsToStore) {
            this.updateProperty('numberRecordsToStore', numberRecordsToStore, null, true, this.numberRecordsToStoreValue);
            this.updateProperty('outputReference', '', null, true, this.outputReferenceValue);
        } else if (this.state.recordLookupElement.assignNullValuesIfNoRecordsFound !== assignNullToVariableNoRecord) {
            this.updateProperty('assignNullValuesIfNoRecordsFound', assignNullToVariableNoRecord, null, true);
        } else if (this.state.wayToStoreFields !== wayToStoreFields) {
            // reset outputAssignments
            this.updateProperty('wayToStoreFields', '', null, true);
            this.state.wayToStoreFields = wayToStoreFields;
        }
    }

    /**
     * @param {Object} event - change event from record-sort component.
     */
    handleRecordSortChanged(event) {
        event.stopPropagation();
        const {fieldApiName, error, sortOrder} = event.detail;
        if (this.state.recordLookupElement.sortField.value !== fieldApiName) {
            this.updateProperty('sortField', fieldApiName, error, false);
        } else {
            // Can't have error on this field, all errors are related to sortFields
            this.updateProperty('sortOrder', sortOrder, null, false);
        }
    }

    /**
     * Handle filterType change and via reducer update element's state accordingly
     * @param {Object} event - event
     */
    handleFilterTypeChanged(event) {
        event.stopPropagation();
        this.updateProperty('filterType', event.detail.filterType, event.detail.error, false);
    }

    /**
     * Handle output assignments change and via reducer update element's state accordingly
     * @param {Object} event - event
     */
    handleRecordInputOutputAssignmentsChanged(event) {
        event.stopPropagation();
        this.state.recordLookupElement = recordLookupReducer(this.state.recordLookupElement, event);
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
        this.state.recordLookupElement = recordLookupReducer(this.state.recordLookupElement, propChangedEvent);
    }
}