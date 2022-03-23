// @ts-nocheck
import { LocatorIconClickedEvent } from 'builder_platform_interaction/events';
import { actionUtils, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './usedByContentItemLabels';
const { getCustomIconNameAndSrc } = actionUtils;

const { logInteraction } = loggingUtils;

export default class UsedByContentItem extends LightningElement {
    _customIconName: string | null = null;
    _customIconSrc: string | null = null;
    _invocableApexActions;

    @api
    listItem;

    @api
    showLocatorIcon = false;

    @api
    set invocableApexActions(invocableApexActions) {
        this._invocableApexActions = invocableApexActions;
        const { iconName, iconSrc } = getCustomIconNameAndSrc(
            this.listItem?.type,
            this.listItem?.actionName,
            this._invocableApexActions
        );
        this._customIconName = iconName;
        this._customIconSrc = iconSrc;
    }

    get invocableApexActions() {
        return this._invocableApexActions;
    }

    get showLocatorIconForCanvasElements() {
        return this.showLocatorIcon && this.listItem.isCanvasElement;
    }

    get labels() {
        return LABELS;
    }

    get iconName() {
        return this._customIconName ? this._customIconName : this.listItem.iconName;
    }

    get iconSrc() {
        return this._customIconSrc ? this._customIconSrc : null;
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
