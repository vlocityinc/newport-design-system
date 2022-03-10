// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class RightPanel extends LightningElement {
    static delegatesFocus = true;

    cssClassBase = 'slds-panel slds-size_full slds-panel_docked slds-panel_docked-right slds-is-open ';

    @api
    isVariableWidth = false;

    get cssClass() {
        return this.cssClassBase + (this.isVariableWidth ? '' : 'fixed-width');
    }
}
