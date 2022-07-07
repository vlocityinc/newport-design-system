import { api, LightningElement } from 'lwc';

export default class ScreenPicklistMoreDetailsCard extends LightningElement {
    @api
    popupTriggerLabel = '';

    @api
    sideText = '';

    @api
    popupText = '';

    get popup() {
        return this.template.querySelector('.slds-popover') as any;
    }

    handleMouseover() {
        this.popup.classList.remove('slds-fall-into-ground');
        this.popup.classList.add('slds-rise-from-ground');
    }

    handleMouseout() {
        this.popup.classList.remove('slds-rise-from-ground');
        this.popup.classList.add('slds-fall-into-ground');
    }
}
