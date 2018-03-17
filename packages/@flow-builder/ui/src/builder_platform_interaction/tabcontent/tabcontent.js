import { Element, api } from 'engine';

const CLASS_ACTIVE = "slds-tabs_default__content slds-show";
const CLASS_INACTIVE = "slds-tabs_default__content slds-hide";

export default class Tabcontent extends Element {
    @api contentid;
    @api labelledby;
    @api activeid;

    get className() {
        return (this.activeid === this.labelledby) ? CLASS_ACTIVE : CLASS_INACTIVE;
    }
}