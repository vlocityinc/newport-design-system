import { LightningElement, api, track } from "lwc";
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { assignmentReducer } from './assignment-reducer';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { LABELS } from './assignment-editor-labels';

/**
 * @constant UPDATE_PROPERTY
 * @type {string}
 */

export default class AssignmentEditor extends LightningElement {
    /**
     * Internal state for the assignment editor
     */
    @track assignmentElement;

    labels = LABELS;

    get expressionBuilderConfig() {
        return { elementType: ELEMENT_TYPE.ASSIGNMENT };
    }

    get showDelete() {
        return this.assignmentElement.assignmentItems.length > 1;
    }

    @api
    get node() {
        return this.assignmentElement;
    }

    set node(newValue) {
        this.assignmentElement = newValue || {};
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.assignmentElement;
    }

    /**
     * public api function to run the rules from assignment validation library
     * @returns {object} list of errors
     */
    @api validate() {
        // we may want to use createAction here ?
        const event = { type: VALIDATE_ALL };
        this.assignmentElement = assignmentReducer(this.assignmentElement, event);
        return getErrorsFromHydratedElement(this.assignmentElement);
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.assignmentElement = assignmentReducer(this.assignmentElement, event);
    }
}
