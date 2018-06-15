import { Element, api, track, unwrap } from 'engine';
import { recordLookupReducer } from './record-lookup-reducer';
import { ENTITY_TYPE, getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { RESOURCE_PICKER_MODE } from 'builder_platform_interaction-expression-utils';
import { LABELS } from './record-lookup-editor-labels';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';

export default class RecordLookupEditor extends Element {
    labels = LABELS;

    crudFilterType = ENTITY_TYPE.QUERYABLE;
    resourcePickerMode = RESOURCE_PICKER_MODE.ENTITY_MODE;

    @track
    fields = {};
    /**
     * Internal state for the editor
     */
    @track recordLookupElement = {};

    @track
    recordEntityName = '';

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
     * public api function to run the rules from actionCall validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        return [];
    }

    get filterItems() {
        return this.recordLookupElement.filters;
    }

    get filterType() {
        return this.recordLookupElement.filterType.value;
    }

    get recordFields() {
        return this.fields;
    }

    get elementType() {
        return this.recordLookupElement.elementType;
    }

    get sortOrder() {
        if (this.recordLookupElement.sortOrder) {
            return this.recordLookupElement.sortOrder.value;
        }
        return 'NotSorted';
    }

    get sortField() {
        if (this.recordLookupElement.sortField) {
            return this.recordLookupElement.sortField.value;
        }
        return '';
    }

    get numberRecordsToStore() {
        if (this.recordLookupElement.outputReference && this.recordLookupElement.outputReference.value) {
            const variable = getElementByGuid(this.recordLookupElement.outputReference.value);
            return variable.dataType === 'SObject' && variable.isCollection ? 'allRecord' : 'firstRecord';
        }
        // TODO : Modify it when implementing : W-4961821
        return 'firstRecord';
    }

    get assignNullValuesIfNoRecordsFound() {
        return this.recordLookupElement.assignNullValuesIfNoRecordsFound;
    }

    get isCollection() {
        return this.numberRecordsToStore === 'allRecord';
    }

    get outputReference() {
        if (this.recordLookupElement.outputReference && this.recordLookupElement.outputReference.value) {
            return this.recordLookupElement.outputReference.value;
        }
        return '';
    }

    get queriedFields() {
        return this.recordLookupElement.queriedFields;
    }

    updateFields() {
        if (this.recordEntityName) {
            getFieldsForEntity(this.recordEntityName, (fields) => {
                this.fields = fields;
            });
        }
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        // TODO: call reducer to filters - W-4961522
        this.recordLookupElement = recordLookupReducer(this.recordLookupElement, event);
    }

    handleResourceChanged(event) {
        const item = event.detail.item;
        if (item) {
            this.recordEntityName = item.value;
            this.updateFields();
            // TODO: call reducer to update object type, filters, filter type - W-4961522
            this.recordLookupElement = recordLookupReducer(this.recordLookupElement, event);
        }
    }
}