import { Element, api } from 'engine';

/*
 * Component that will contain the tabset should have :
 *  @track activeid = "tab-elements";
 *  handleTabChange(event) {
 *      this.activeid = event.detail.tabId;
 *  }
 */

export default class Tabset extends Element {
    @api isvertical = false;

    get cssclass() {
        return this.isvertical === "true" ? "slds-vertical-tabs" : "slds-tabs_default";
    }

    get ulcssclass() {
        return this.isvertical  === "true" ? "slds-vertical-tabs__nav" : "slds-tabs_default__nav";
    }
}