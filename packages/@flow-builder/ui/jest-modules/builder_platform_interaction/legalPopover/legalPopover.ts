import { api, LightningElement } from 'lwc';

export default class LegalPopover extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-legal-popover';

    @api
    legalTextFirstPart;

    @api
    agreementUrlLabel;

    @api
    legalTextSecondPart;

    @api
    horizontalPosition;

    @api
    notices;

    @api
    updatePopupPosition = jest.fn();
}
