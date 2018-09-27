import { LightningElement, api, track } from 'lwc';
import { LABELS } from './stepEditorLabels';
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";

export default class StepEditor extends LightningElement {
    labels = LABELS;

    /**
     * Internal state for the step editor
    */
    @track
    stepElement = {};

    // used to keep track of whether this is an existing step element
    @api
    isNewMode = false;
    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     * @returns {object} node - node
     */
    @api
    get node() {
        return this.stepElement;
    }

    set node(newValue) {
        this.stepElement = newValue || {};
    }

    @api
    getNode() {
        return this.stepElement;
    }

    @api
    validate() {
        return getErrorsFromHydratedElement(this.stepElement);
    }
}