// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class AlcCanvas extends LightningElement {
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
    supportsScheduledPaths;

    @api
    disableAnimation;

    @api
    disableDebounce;

    @api closeNodeOrConnectorMenu = jest.fn();
}
