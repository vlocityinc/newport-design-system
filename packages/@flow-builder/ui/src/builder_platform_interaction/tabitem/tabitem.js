import { Element, api } from 'engine';

const CLASS_ACTIVE = "slds-truncate slds-tabs_default__item slds-is-active";
const CLASS_INACTIVE = "slds-truncate slds-tabs_default__item";

export default class TabItem extends Element {
    @api tabid;
    @api label;
    @api controls;
    @api activeid;

    get className() {
        return (this.activeid === this.tabid) ? CLASS_ACTIVE : CLASS_INACTIVE;
    }

    handleClick(event) {
        event.preventDefault();

        // If the tab is already active there's no need to fire a change
        // event.
        if (this.activeid === this.tabid) {
            return;
        }

        const tabChangeEvent = new CustomEvent("tabchange", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                tabId: this.tabid
            }
        });
        this.dispatchEvent(tabChangeEvent);
    }
}