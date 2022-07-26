// @ts-nocheck
import { FAULT_INDEX, parseConnectionSourceRef } from 'builder_platform_interaction/autoLayoutCanvas';
import { LocatorIconClickedEvent } from 'builder_platform_interaction/events';
import { commonUtils, customIconUtils, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './usedByContentItemLabels';
const { format } = commonUtils;

const { getCustomIconNameOrSrc } = customIconUtils;

const { logInteraction } = loggingUtils;

export default class UsedByContentItem extends LightningElement {
    _customIconMap: { [key: string]: string } = {};

    @api
    listItem;

    @api
    showLocatorIcon = false;

    @api
    itemType = 'used-by';

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

    get iconSize() {
        return this.listItem.iconName === 'utility:right' ? 'x-small' : 'small';
    }

    /**
     * Takes the element name and augments it so that it includes the branch information if applicable
     *
     * @returns the newly modified name
     */
    get itemName() {
        if (!this.listItem.branchLabel) {
            return this.listItem.name;
        } else if (this.listItem.childIndex === FAULT_INDEX) {
            return format(LABELS.incomingGoToConnectionsWithFaultPath, this.listItem.name);
        }
        return format(LABELS.incomingGoToConnectionsWithBranch, this.listItem.branchLabel, this.listItem.name);
    }

    /**
     * Dispatches the LocatorIconClickedEvent that highlights the element on canvas
     *
     * @param {object} event onclick event
     */
    handleUsageSectionLocatorClick(event) {
        const sourceRef = event?.currentTarget?.dataset?.guid;
        const { guid, childIndex } = parseConnectionSourceRef(sourceRef); // Only take the source element guid, and not the suffix
        const locatorIconEvent = new LocatorIconClickedEvent(guid, childIndex, this.itemType === 'incoming-info');
        this.dispatchEvent(locatorIconEvent);
        logInteraction(`find-in-canvas-button`, 'resource-details', null, 'click');
    }
}
