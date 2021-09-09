// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class AlcConnectorMenu extends LightningElement {
    @api
    source;

    @api
    elementsMetadata;

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
