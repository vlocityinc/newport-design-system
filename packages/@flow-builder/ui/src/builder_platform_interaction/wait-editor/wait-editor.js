import { LightningElement, api, track } from 'lwc';
import { waitReducer } from './wait-reducer';

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

    handleEvent(event) {
        event.stopPropagation();
        this.waitElement = waitReducer(this.waitElement, event);
    }
}