// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class AlcConnectorMenu extends LightningElement {
    @api
    childIndex;

    @api
    elementsMetadata;

    @api
    next;

    @api
    parent;

    @api
    prev;

    @api
    isPasteAvailable;

    @api
    hasEndElement;

    @api
    canAddGoto!: boolean;

    @api
    isGoToConnector!: boolean;

    @api
    moveFocusToMenu;
}
