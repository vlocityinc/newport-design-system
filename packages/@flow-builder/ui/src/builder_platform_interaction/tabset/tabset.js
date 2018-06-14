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

    @api
    get cssclass() {
        return this.classList;
    }

    @api
    set cssclass(value) {
        const classes = ["slds-show", "slds-hide", "slds-vertical-tabs", "slds-tabs_default"];
        for (let i = 0; i < classes.length; i++) {
            this.classList.remove(classes[i]);
        }
        this.classList.add(value);
        if (this.isvertical === "true") {
            this.classList.add("slds-vertical-tabs");
        } else {
            this.classList.add("slds-tabs_default");
        }
    }

    get ulcssclass() {
        return this.isvertical  === "true" ? "slds-vertical-tabs__nav" : "slds-tabs_default__nav";
    }
}