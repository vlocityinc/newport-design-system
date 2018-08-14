import { LightningElement, api, track } from "lwc";
import { recordReducer } from './record-reducer';
import { ENTITY_TYPE } from 'builder_platform_interaction-sobject-lib';
import { RESOURCE_PICKER_MODE, getResourceByUniqueIdentifier } from 'builder_platform_interaction-expression-utils';
import { LABELS } from './record-editor-labels';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { RECORD_FILTER_CRITERIA, NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction-record-editor-lib';

export default class RecordEditor extends LightningElement {
    labels = LABELS;

    crudFilterType = ENTITY_TYPE.QUERYABLE
    resourcePickerMode = RESOURCE_PICKER_MODE.ENTITY_MODE

    @track
    resourceApiName;
    /**
     * Internal state for the editor
     */
    @track recordNode = {};

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.node;
    }

    @api
    get node() {
        return this.recordNode;
    }

    set node(newValue) {
        this.recordNode = newValue;
    }

    get numberRecordsToStore() {
        if (this.recordNode.outputReference && this.recordNode.outputReference.value) {
            const variable = getResourceByUniqueIdentifier(this.recordNode.outputReference.value);
            return variable.dataType === "SObject" && variable.isCollection ? NUMBER_RECORDS_TO_STORE.ALL_RECORDS : NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
        }
        // TODO : Modify it when implementing : W-4961821
        return NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
    }

    get assignNullValuesIfNoRecordsFound() {
        return this.recordNode.assignNullValuesIfNoRecordsFound;
    }

    /**
     * public api function to run the rules from actionCall validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        return [];
    }
    get filterItems() {
        // TODO: should be mutated and get from element.filters
        return [];
    }

    get recordFields() {
        // TODO: should be queried from resourceApiName
        return {};
    }

    get filterType() {
        // TODO: should be mutated and get from element.filterType
        return RECORD_FILTER_CRITERIA.NONE;
    }

    get showFilter() {
        return this.elementType !== ELEMENT_TYPE.RECORD_CREATE;
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.recordNode = recordReducer(this.element, event);
    }

    handleResourceChanged(event) {
        const item = event.detail.item;
        this.resourceApiName = item ? item.value : null;
    }

    handleFieldSelected(event) {
        event.stopPropagation();
        // TODO: Handle Field Selection Event in W-4961522
    }
}