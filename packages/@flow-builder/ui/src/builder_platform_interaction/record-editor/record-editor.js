import { Element, api, track, unwrap } from 'engine';
import { recordReducer } from './record-reducer';
import { ENTITY_TYPE, getFieldsForEntity } from 'builder_platform_interaction-sobject-lib';
import { RESOURCE_PICKER_MODE } from 'builder_platform_interaction-expression-utils';
import { LABELS } from './record-editor-labels';

export default class RecordEditor extends Element {
    labels = LABELS;

    crudFilterType = ENTITY_TYPE.QUERYABLE
    resourcePickerMode = RESOURCE_PICKER_MODE.ENTITY_MODE

    @track
    fields = [];
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

    /**
     * public api function to run the rules from actionCall validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        return [];
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
        getFieldsForEntity(item.id, (fields) => {
            this.fields = fields;
        });
    }

    handleFieldSelected(event) {
        event.stopPropagation();
        // TODO: Handle Field Selection Event in W-4961522
    }
}