// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class AlcConnectorMenu extends LightningElement {
    static className = 'connector-menu';

    @api
    metadata;

    @api
    source;

    @api
    elementsMetadata;

    @api
    isPasteAvailable;

    @api
    canAddEndElement;

    @api
    canAddGoto!: boolean;

    @api
    isGoToConnector!: boolean;

    @api
    moveFocusToMenu;
}
