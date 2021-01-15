// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class FlcBuilder extends LightningElement {
    @api
    elementsMetadata;

    @api
    isSelectionMode;

    @api
    flowModel;

    @api
    offsets;

    @api
    isPasteAvailable;

    @api
    disableAddElements;

    @api
    disableDeleteElements;

    @api
    supportsTimeTriggers;
}
