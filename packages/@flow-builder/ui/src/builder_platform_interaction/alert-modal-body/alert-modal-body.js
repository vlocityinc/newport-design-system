import { LightningElement, api } from "lwc";

export default class AlertModalBody extends LightningElement {
    @api bodyTextOne;
    @api bodyTextTwo;
    @api listSectionHeader;
    @api listSectionItems;
}