import { LightningElement, api } from 'lwc';

export default class UsedByContent extends LightningElement {
    @api listSectionHeader;
    @api listSectionItems;
    @api isResourceDetails = false;
}
