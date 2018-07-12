import { Element, api } from 'engine';

export default class AlertModalBody extends Element {
    @api bodyTextOne;
    @api bodyTextTwo;
    @api listSectionHeader;
    @api listSectionItems;
}