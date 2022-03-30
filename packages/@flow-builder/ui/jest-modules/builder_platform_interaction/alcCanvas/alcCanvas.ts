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

    @api customIconMap;
}
