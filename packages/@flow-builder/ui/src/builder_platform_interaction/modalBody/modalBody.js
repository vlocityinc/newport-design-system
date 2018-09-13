import { LightningElement, api } from 'lwc';

export default class ModalBody extends LightningElement {
    @api bodyTextOne;
    @api bodyTextTwo;
    @api listSectionHeader;
    @api listSectionItems;
}