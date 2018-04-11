import { Element, api, track, unwrap } from 'engine';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { assignmentReducer } from './assignment-reducer';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

/**
 * @constant UPDATE_PROPERTY
 * @type {string}
 */

export default class AssignmentEditor extends Element {
    /**
     * Internal state for the assignment editor
     */
    @track element = {};

    get addLabel() {
        // TODO labels W-4813532
        return 'Add';
    }

    get elementType() {
        return ELEMENT_TYPE.ASSIGNMENT;
    }

    get showDelete() {
        return this.assignmentItems.length > 1;
    }

    @api
    get node() {
        return this.element;
    }

    @api
    set node(newValue) {
        this.element = newValue || {};
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.element);
    }

    /**
     * public api function to run the rules from assignment validation library
     * @returns {object} list of errors
     */
    @api validate() {
        // NOTE: if we find there is a case where an error can happen on a filed without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        return getErrorsFromHydratedElement(this.element);
    }

    /**
     * @returns {object} label, eg : {value: "xyz", error: null}
     */
    get label() {
        return (this.element && this.element.label) ? this.element.label : undefined;
    }

    /**
     * @returns {object} description
     */
    get description() {
        return (this.element && this.element.description) ? this.element.description : undefined;
    }

    /**
     * @returns {object} devName
     */
    get devName() {
        return (this.element && this.element.name) ? this.element.name : undefined;
    }

    get assignmentItems() {
        return this.element && this.element.assignmentItems ? this.element.assignmentItems : [];
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.element = assignmentReducer(this.element, event);
    }
}
