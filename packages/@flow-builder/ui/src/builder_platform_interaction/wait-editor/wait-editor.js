import { LightningElement, api, track } from 'lwc';
import { waitReducer } from './wait-reducer';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

export default class WaitEditor extends LightningElement {
    /**
     * internal state for the wait editor
     */
    @track waitElement;

    @api
    get node() {
        return this.waitElement;
    }

    set node(newValue) {
        this.waitElement = newValue || {};
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.waitElement;
    }

    /**
     * public api function to run the rules from wait validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.waitElement = waitReducer(this.waitElement, event);
        return getErrorsFromHydratedElement(this.waitElement);
    }

    handleEvent(event) {
        event.stopPropagation();
        this.waitElement = waitReducer(this.waitElement, event);
    }
}
