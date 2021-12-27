import {
    LocatorIconClickedEvent,
    PaletteItemChevronClickedEvent,
    PaletteItemClickedEvent
} from 'builder_platform_interaction/events';
import { keyboardInteractionUtils, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './paletteSectionLabels';

const { withKeyboardInteractions, GridKeyboardInteraction } = keyboardInteractionUtils;
const { logInteraction } = loggingUtils;

export default class PaletteSection extends withKeyboardInteractions(LightningElement) {
    @api section;
    @api iconSize;
    @api enableLocator;
    @api showResourceDetails;
    @api itemsDraggable;

    labels = LABELS;
    gridKeyboardInteraction;

    /**
     * Get the keyboard interactions for this component
     *
     * @returns the keyboard interactions
     */
    getKeyboardInteractions() {
        if (!this.gridKeyboardInteraction) {
            this.gridKeyboardInteraction = new GridKeyboardInteraction(this.template);
        }

        return [this.gridKeyboardInteraction];
    }

    /**
     * Handler for when an element is dragged.
     *
     * @param {Object} event drag start event
     */
    handleDragStart(event) {
        if (event) {
            const referenceElement = event.currentTarget;
            const item = this.section._children.find((section) => section.guid === referenceElement.dataset.guid);

            // Only items in the map should be considered draggable.
            if (!item) {
                event.dataTransfer.effectAllowed = 'none';
                return;
            }

            const paletteItem = referenceElement.querySelector('builder_platform_interaction-palette-item');
            let dragElement = paletteItem.dragImage;
            if (!dragElement) {
                const elementIcon = paletteItem.elementIcon;
                dragElement = elementIcon && elementIcon.iconElement;
            }

            const eventDetail = {
                elementType: item.elementType,
                elementSubtype: item.elementSubtype,
                actionType: item.actionType,
                actionName: item.actionName,
                key: item.guid
            };
            event.dataTransfer.setData('text', JSON.stringify(eventDetail));
            if (event.dataTransfer.setDragImage && dragElement) {
                event.dataTransfer.setDragImage(dragElement, 0, 0);
            }
            event.dataTransfer.effectAllowed = 'copy';
        }
    }

    /**
     * Dispatches the LocatorIconClickedEvent that highlights the element on canvas
     *
     * @param event - onclick event
     */
    handleLocatorClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        // @ts-ignore
        const { guid } = event.currentTarget.querySelector('lightning-button-icon').dataset;
        const locatorIconEvent = new LocatorIconClickedEvent(guid);
        this.dispatchEvent(locatorIconEvent);
    }

    /**
     * Dispatches an event which opens the resource details panel.
     *
     * @param event - A resource details button click event
     */
    handleResourceDetailsClick(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        // @ts-ignore
        const { guid, iconName } = event.currentTarget.querySelector('lightning-button-icon').dataset;
        const paletteItemChevronClickedEvent = new PaletteItemChevronClickedEvent(guid, iconName);
        this.dispatchEvent(paletteItemChevronClickedEvent);
        logInteraction('element-details', 'manager-tab', null, 'click');
    }

    handleLinkClick(event) {
        event.stopPropagation();
        event.preventDefault();

        const guid = event.currentTarget.querySelector('builder_platform_interaction-palette-item').guid;

        const { elementType, elementSubtype } = this.section._children.find((child) => child.guid === guid);
        const paletteItemClickedEvent = new PaletteItemClickedEvent(elementType, guid, elementSubtype);
        this.dispatchEvent(paletteItemClickedEvent);
    }
}
