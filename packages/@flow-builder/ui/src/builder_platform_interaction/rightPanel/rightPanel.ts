// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class RightPanel extends LightningElement {
    cssClassBase = 'slds-panel slds-size_full slds-panel_docked slds-panel_docked-right slds-is-open ';

    @api
    isVariableWidth = false;

    get cssClass() {
        return this.cssClassBase + (this.isVariableWidth ? '' : 'fixed-width');
    }
}
