import { LightningElement, api } from 'lwc';
import { LocatorIconClickedEvent } from 'builder_platform_interaction/events';
import { LABELS } from './usedByContentItemLabels';

export default class UsedByContentItem extends LightningElement {
    @api listItem;
    @api showLocatorIcon = false;

    get showLocatorIconForNonChildElements() {
        return (this.showLocatorIcon && !this.listItem.isChildElement);
    }

    get labels() {
        return LABELS;
    }

    /**
     * Dispatches the LocatorIconClickedEvent that highlights the element on canvas
     * @param {object} event onclick event
     */
    handleUsageSectionLocatorClick(event) {
        const guid = event && event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.guid;
        const locatorIconEvent = new LocatorIconClickedEvent(guid);
        this.dispatchEvent(locatorIconEvent);
    }
}