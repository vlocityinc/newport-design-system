import { Element, api, track, unwrap } from 'engine';
import { recordReducer } from './record-reducer';

export default class RecordEditor extends Element {
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
}