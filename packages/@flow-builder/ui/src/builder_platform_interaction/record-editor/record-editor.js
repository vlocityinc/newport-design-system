import { Element, api, track, unwrap } from 'engine';
import { recordReducer } from './record-reducer';
import { ENTITY_TYPE } from 'builder_platform_interaction-sobject-lib';
import { RESOURCE_PICKER_MODE } from 'builder_platform_interaction-expression-utils';
import { LABELS } from './record-editor-labels';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { ELEMENT_TYPE, RECORD_FILTER_CRITERIA } from 'builder_platform_interaction-flow-metadata';

export default class RecordEditor extends Element {
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
     * public api function to return the unwrapped node
     *
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.node);
    }

    @api
    get node() {
        return this.recordNode;
    }

    @api
    set node(newValue) {
        this.recordNode = newValue;
    }

    /**
     * @returns {object} label, eg : {value: "xyz", error: null}
     */
    get label() {
        return this.recordNode.label;
    }

    /**
     * @returns {object} description
     */
    get description() {
        return this.recordNode.description;
    }

    /**
     * @returns {object} devName
     */
    get devName() {
        return this.recordNode.name;
    }

    get elementType() {
        return this.recordNode.elementType;
    }

    get numberRecordsToStore() {
        if (this.recordNode.outputReference && this.recordNode.outputReference.value) {
            const variable = getElementByGuid(this.recordNode.outputReference.value);
            return variable.dataType === "SObject" && variable.isCollection ? "allRecord" : "firstRecord";
        }
        // TODO : Modify it when implementing : W-4961821
        return "firstRecord";
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
        this.element = recordReducer(this.element, event);
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