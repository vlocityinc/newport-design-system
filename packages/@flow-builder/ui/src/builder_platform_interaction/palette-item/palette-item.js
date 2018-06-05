import { Element, api } from 'engine';
import { PaletteItemClickedEvent, PaletteItemChevronClickedEvent } from 'builder_platform_interaction-events';

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */
export default class PaletteItem extends Element {
    @api description;
    @api elementType;
    @api guid;
    @api iconName;
    @api label;
    @api iconSize;

    get hasIcon() {
        return this.iconName !== undefined && this.iconName !== null && this.iconName.length > 0;
    }

    handleLinkClick(event) {
        event.stopPropagation();
        const elementType = this.elementType;
        const guid = this.guid;
        const paletteItemClickedEvent = new PaletteItemClickedEvent(elementType, guid);
        this.dispatchEvent(paletteItemClickedEvent);
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

    @api
    get iconElement() {
        return this.template.querySelector('lightning-icon.drag-element');
    }
}
