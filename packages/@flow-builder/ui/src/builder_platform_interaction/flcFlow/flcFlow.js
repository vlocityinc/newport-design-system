import { LightningElement, api } from 'lwc';

export default class FlcFlow extends LightningElement {
    @api
    flow;

    @api
    menu;

    @api
    force;

    @api
    isPasteAvailable;

    @api
    isSelectionMode;
}
