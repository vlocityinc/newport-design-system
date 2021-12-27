import { api, LightningElement } from 'lwc';

export default class ModalBodyForAutoLayout extends LightningElement {
    @api bodyTextOne;

    get bodyTextContainerClass() {
        return 'slds-text-longform slds-p-horizontal_small slds-p-top_small';
    }

    get bodyTextOneClass() {
        return 'slds-text-align_center';
    }
}
