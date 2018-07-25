import { Element, api, track, unwrap } from 'engine';
import { recordLookupReducer } from './record-lookup-reducer';
import { ENTITY_TYPE, getFieldsForEntity, getAllEntities } from 'builder_platform_interaction-sobject-lib';
import { LABELS } from './record-lookup-editor-labels';
import { getResourceByUniqueIdentifier } from 'builder_platform_interaction-expression-utils';
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

    sObjectName = '';

    /**
     * The default value of number records to store.
     */
    numberRecordsToStoreValue = NUMBER_RECORDS_TO_STORE.FIRST_RECORD;

    crudFilterType = ENTITY_TYPE.QUERYABLE

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
     * @returns {Object} the entity fields
     */
    get recordFields() {
        return this.fields;
    }

    /**
     * @returns {String} number of records to store (see record-editor-lib.NUMBER_RECORDS_TO_STORE)
     */
    get numberRecordsToStore() {
        if (this.recordLookupElement.outputReference && this.recordLookupElement.outputReference.value) {
            const variable = getResourceByUniqueIdentifier(this.recordLookupElement.outputReference.value);
            if (variable) {
                this.sObjectName = variable.dataType === FLOW_DATA_TYPE.SOBJECT.value ? variable.guid : '';
                this.numberRecordsToStoreValue = variable.dataType === FLOW_DATA_TYPE.SOBJECT.value && variable.isCollection ? NUMBER_RECORDS_TO_STORE.ALL_RECORDS : NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
            }
        }
        // TODO : Modify it when implementing : W-4961821
        return this.numberRecordsToStoreValue;
    }

    /**
     * @returns {boolean} true if you want to store all the records to an sObject collection variable
     */
    get isCollection() {
        return this.numberRecordsToStore === NUMBER_RECORDS_TO_STORE.ALL_RECORDS;
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
     * @returns {String} the output reference error message
     */
    get outputReferenceErrorMessage() {
        if (this.recordLookupElement.outputReference) {
            return this.recordLookupElement.outputReference.error;
        }
        return '';
    }

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object,
            this.labels.objectPlaceholder,
            this.recordLookupElement.object.error,
            false,
            true,
            false,
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    get resourceDisplayText() {
        const entityToDisplay = getAllEntities().filter(entity => entity.apiName === this.recordEntityName);
        if (entityToDisplay.length === 1) {
            return entityToDisplay[0].entityLabel;
        }
        return '';
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
        this.updateProperty('outputReference', event.detail.value, event.detail.error, false, this.sObjectName);
    }

    /**
     * @param {object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const oldRecordEntityName = this.recordEntityName;
        if (event.detail.item && !event.detail.error && this.recordEntityName !== event.detail.item.value) {
            this.recordEntityName = event.detail.item.value;
            this.updateFields();
        }
        const value = event.detail.item ? event.detail.item.value : event.detail.displayText;
        this.updateProperty('object', value, event.detail.error, false, oldRecordEntityName);
    }

    /**
     * @param {object} event - recordstoreoptionchanged event from record-store-options component.
     */
    handleRecordStoreOptionsChanged(event) {
        event.stopPropagation();
        if (this.numberRecordsToStoreValue !== event.detail.numberRecordsToStore) {
            this.numberRecordsToStoreValue = event.detail.numberRecordsToStore;
            this.updateProperty('outputReference', '', null, true, this.sObjectName);
        } else if (this.recordLookupElement.assignNullValuesIfNoRecordsFound !== event.detail.assignNullToVariableNoRecord) {
            this.updateProperty('assignNullValuesIfNoRecordsFound', event.detail.assignNullToVariableNoRecord, null, false);
        }
    }

    /**
     * @param {object} event - change event from record-sort component.
     */
    handleRecordSortChanged(event) {
        event.stopPropagation();
        if (this.recordLookupElement.sortField.value !== event.detail.fieldApiName) {
            this.updateProperty('sortField', event.detail.fieldApiName, event.detail.error, false);
        } else {
            this.updateProperty('sortOrder', event.detail.sortOrder, event.detail.error, false);
        }
    }

    handleFilterTypeChanged(event) {
        event.stopPropagation();
        this.updateProperty('filterType', event.detail.filterType, event.detail.error, false);
    }

    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.recordLookupElement = recordLookupReducer(this.recordLookupElement, propChangedEvent);
    }
}