// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { useFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';

export default class UsedByContent extends LightningElement {
    @api listSectionHeader;
    @api listSectionItems;
    @api isResourceDetails = false;

    get shouldShowLocatorIcon() {
        return !useFixedLayoutCanvas() && this.isResourceDetails;
    }
}
