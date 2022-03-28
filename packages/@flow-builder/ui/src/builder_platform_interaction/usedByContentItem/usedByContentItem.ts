// @ts-nocheck
import { LocatorIconClickedEvent } from 'builder_platform_interaction/events';
import { customIconUtils, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './usedByContentItemLabels';
const { getCustomIconNameOrSrc } = customIconUtils;

const { logInteraction } = loggingUtils;

export default class UsedByContentItem extends LightningElement {
    _customIconMap: { [key: string]: string } = {};

    @api
    listItem;

    @api
    showLocatorIcon = false;

    @api
    get customIconMap() {
        return this._customIconMap;
    }

    set customIconMap(iconMap) {
        this._customIconMap = iconMap;
    }

    get showLocatorIconForCanvasElements() {
        return this.showLocatorIcon && this.listItem.isCanvasElement;
    }

    get labels() {
        return LABELS;
    }

    get iconName() {
        const { iconName: customIconName } = getCustomIconNameOrSrc(this.listItem?.actionName, this._customIconMap);
        return customIconName ? customIconName : this.listItem.iconName;
    }

    get iconSrc() {
        const { iconSrc } = getCustomIconNameOrSrc(this.listItem?.actionName, this._customIconMap);
        return iconSrc ? iconSrc : null;
    }

    /**
     * Dispatches the LocatorIconClickedEvent that highlights the element on canvas
     *
     * @param {object} event onclick event
     */
    handleUsageSectionLocatorClick(event) {
        const guid = event && event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.guid;
        const locatorIconEvent = new LocatorIconClickedEvent(guid);
        this.dispatchEvent(locatorIconEvent);
        logInteraction(`find-in-canvas-button`, 'resource-details', null, 'click');
    }
}
