import { LightningElement, api } from 'lwc';

export default class FlcBuilder extends LightningElement {
    @api
    elementsMetadata;

    @api
    isPasteAvailable;

    @api
    isSelectionMode;

    @api
    flowModel;
}
