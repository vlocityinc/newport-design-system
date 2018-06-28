import { Element, api, track, unwrap } from 'engine';
import { recordLookupReducer } from './record-lookup-reducer';
import { getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { LABELS } from './record-lookup-editor-labels';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import BaseResourcePicker from 'builder_platform_interaction-base-resource-picker';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction-record-editor-lib';

export default class RecordLookupEditor extends Element {
    labels = LABELS;

    @track
    fields = {};
    /**
     * Internal state for the editor
     */
    @track recordLookupElement = {};

    @track
    recordEntityName = '';

    @track
    sobjectValueError;

    /**
     * The default value of number records to store.
     */
    numberRecordsToStoreValue = NUMBER_RECORDS_TO_STORE.FIRST_RECORD;

    /**
     * public api function to return the unwrapped node
     *
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.recordLookupElement);
    }

    @api
    get node() {
        return this.recordLookupElement;
    }

    @api
    set node(newValue) {
        this.recordLookupElement = newValue;
        this.recordEntityName = this.recordLookupElement.object.value;
        this.updateFields();
    }

    /**
     * public api function to run the rules from record lookup validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.recordLookupElement = recordLookupReducer(this.recordLookupElement, event);
        return getErrorsFromHydratedElement(this.recordLookupElement);
    }

    /**
     * @returns {Object[]} list of filters
     */
    get filterItems() {
        return this.recordLookupElement.filters;
    }

    /**
     * @returns {String} type to filter (see record-editor-lib.RECORD_FILTER_CRITERIA)
     */
    get filterType() {
        return this.recordLookupElement.filterType.value;
    }

    /**
     * @returns {Object} the entity fields
     */
    get recordFields() {
        return this.fields;
    }

    /**
     * @returns {String} the type of node
     */
    get elementType() {
        return this.recordLookupElement.elementType;
    }

    /**
     * @returns {String} the order to sort (see record-editor-lib.SORT_ORDER)
     */
    get sortOrder() {
        return this.recordLookupElement.sortOrder.value;
    }

    /**
     * @returns {String} field to sort
     */
    get sortField() {
        return this.recordLookupElement.sortField.value;
    }

    /**
     * @returns {String} number of records to store (see record-editor-lib.NUMBER_RECORDS_TO_STORE)
     */
    get numberRecordsToStore() {
        if (this.recordLookupElement.outputReference && this.recordLookupElement.outputReference.value) {
            const variable = getElementByGuid(this.recordLookupElement.outputReference.value);
            if (variable) {
                return variable.dataType === FLOW_DATA_TYPE.SOBJECT.value && variable.isCollection ? NUMBER_RECORDS_TO_STORE.ALL_RECORDS : NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
            }
        }
        // TODO : Modify it when implementing : W-4961821
        return this.numberRecordsToStoreValue;
    }

    /**
     * @returns {boolean} true if you want to assign null values if no records are found
     */
    get assignNullValuesIfNoRecordsFound() {
        return this.recordLookupElement.assignNullValuesIfNoRecordsFound;
    }

    /**
     * @returns {boolean} true if you want to store all the records to an sObject collection variable
     */
    get isCollection() {
        return this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.ALL_RECORDS;
    }

    /**
     * @returns {String} the sObject or sObject collection variable that you want to assign the records to reference them later
     */
    get outputReference() {
        if (this.recordLookupElement.outputReference && this.recordLookupElement.outputReference.value) {
            return this.recordLookupElement.outputReference.value;
        }
        return '';
    }

    /**
     * @returns {String[]} fields of the selected sObject variable that you want to assign the records to reference them later
     */
    get queriedFields() {
        return this.recordLookupElement.queriedFields;
    }

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object,
            this.labels.objectPlaceholder,
            this.sobjectValueError,
            false,
            true,
            false,
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
     * get the fields of the selected entity
     */
    updateFields() {
        if (this.recordEntityName) {
            getFieldsForEntity(this.recordEntityName, (fields) => {
                this.fields = fields;
            });
        }
    }

    /**
     * @param {object} event - property changed event coming from label-description component or the list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(event) {
        event.stopPropagation();
        this.recordLookupElement = recordLookupReducer(this.recordLookupElement, event);
    }

    /**
     * @param {object} event - sobjectreferencechanged event from sobject-or-sobject-collection component. The property name depends on the record node (create/update/lookup)
     */
    handleSObjectReferenceChanged(event) {
        event.stopPropagation();
        this.updateProperty('outputReference', event.detail.value, event.detail.error);
    }

    /**
     * @param {object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        if (event.detail.item) {
            this.recordEntityName = event.detail.item.value;
            this.updateFields();
        }
        this.sobjectValueError = event.detail.error;
        this.updateProperty('object', event.detail.item ? event.detail.item.value : event.detail.displayText, this.sobjectValueError);
    }

    /**
     * @param {object} event - recordstoreoptionchanged event from record-store-options component.
     */
    handleRecordStoreOptionsChanged(event) {
        event.stopPropagation();
        if (this.numberRecordsToStoreValue !== event.detail.numberRecordsToStore) {
            this.numberRecordsToStoreValue = event.detail.numberRecordsToStore;
            this.updateProperty('outputReference', '', null);
        } else if (this.recordLookupElement.assignNullValuesIfNoRecordsFound !== event.detail.assignNullValuesIfNoRecordsFound) {
            this.updateProperty('assignNullValuesIfNoRecordsFound', event.detail.assignNullValuesIfNoRecordsFound, null);
        }
    }

    /**
     * @param {object} event - change event from record-sort component.
     */
    handleRecordSortChanged(event) {
        event.stopPropagation();
        if (this.sortField !== event.detail.fieldApiName) {
            this.updateProperty('sortField', event.detail.fieldApiName, event.detail.error);
        } else {
            this.updateProperty('sortOrder', event.detail.sortOrder, event.detail.error);
        }
    }

    updateProperty(propertyName, newValue, error) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error);
        this.recordLookupElement = recordLookupReducer(this.recordLookupElement, propChangedEvent);
    }
}