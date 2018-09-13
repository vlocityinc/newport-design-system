import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { assignmentReducer } from "./assignmentReducer";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { LABELS } from "./assignmentEditorLabels";

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

    get elementType() {
        return ELEMENT_TYPE.ASSIGNMENT;
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
