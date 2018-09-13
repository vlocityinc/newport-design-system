import { LightningElement, api } from 'lwc';
import { PaletteItemClickedEvent, PaletteItemChevronClickedEvent } from 'builder_platform_interaction/events';
import { isChildElement } from 'builder_platform_interaction/elementConfig';
import { LABELS } from './paletteItemLabels';

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */

export default class PaletteItem extends LightningElement {
    @api description;
    @api elementType;
    @api guid;
    @api iconName;
    @api label;
    @api iconSize;
    @api detailsButton;

    @api
    get iconElement() {
        return this.template.querySelector('lightning-icon.drag-element');
    }

    get labels() {
        return LABELS;
    }

    get hasIcon() {
        return this.iconName !== undefined && this.iconName !== null && this.iconName.length > 0;
    }

    handleLinkClick(event) {
        event.stopPropagation();
        const elementType = this.elementType;
        const guid = this.guid;
        if (!isChildElement(elementType)) {
            const paletteItemClickedEvent = new PaletteItemClickedEvent(elementType, guid);
            this.dispatchEvent(paletteItemClickedEvent);
        }
    }

    handleKeyPress(event) {
        switch (event.key) {
            case ' ':
                // The space bar sometimes scrolls the parent container so we
                // need to prevent the default.
                event.preventDefault();
                // fall through
            case 'Enter':
                this.handleLinkClick(event);
                break;
            default:
                // No special handling for any other keys.
                break;
        }
    }

    handleChevronClick(event) {
        event.stopPropagation();
        const elementType = this.elementType;
        const guid = this.guid;
        const label = this.label;
        const iconName = this.iconName;
        const description = this.description;
        const paletteItemChevronClickedEvent = new PaletteItemChevronClickedEvent(elementType, guid, label, iconName, description);
        this.dispatchEvent(paletteItemChevronClickedEvent);
    }
}
