import { LightningElement, api } from 'lwc';

export default class FlcFlow extends LightningElement {
    @api
    flow;

    @api
    isPasteAvailable;

    @api
    isSelectionMode;
}
