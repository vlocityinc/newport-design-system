// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class UsedByContent extends LightningElement {
    @api listSectionHeader;
    @api listSectionItems;
    @api isResourceDetails = false;
    @api showLocatorIcon;

    get enableLocator() {
        return this.showLocatorIcon && this.isResourceDetails;
    }
}
