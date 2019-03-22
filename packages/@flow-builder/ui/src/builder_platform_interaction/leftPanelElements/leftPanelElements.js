import { LightningElement, track, api } from 'lwc';
import { getElementSections } from "./elementLib";

export default class LeftPanelElements extends LightningElement {
    /**
     * The data format should be compatible with lightning-tree-grid.
     */
    @track leftPanelElementsList = [];

    @api
    get elements() {
        return this.leftPanelElementsList;
    }

    set elements(elementsData) {
        this.leftPanelElementsList = getElementSections(elementsData);
    }
}

