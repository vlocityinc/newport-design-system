import { Element, api } from 'engine';

const TABCONTENT_CLASS = "slds-tabs_default__content slds-p-around_none";

export default class Tabcontent extends Element {
    @api contentid;
    @api labelledby;
    @api activeid;

    get className() {
        return (this.activeid === this.labelledby) ? `${TABCONTENT_CLASS} slds-show` : `${TABCONTENT_CLASS} slds-hide`;
    }
}