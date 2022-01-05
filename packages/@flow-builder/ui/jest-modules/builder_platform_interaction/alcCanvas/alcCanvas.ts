import { api, LightningElement } from 'lwc';

export default class AlcCanvas extends LightningElement {
    @api
    connectorMenuMetadata;

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
    disableEditElements;

    @api
    disableAnimation;

    @api
    disableDebounce;

    @api
    activeElementGuid;

    @api closeNodeOrConnectorMenu = jest.fn();

    @api shortcuts;
}
