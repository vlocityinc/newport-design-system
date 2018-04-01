import { Element, api } from 'engine';

const PALETTE_ITEM_CLICKED = 'paletteitemclicked';

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
    @api iconSize;
    @api label;

    get hasIcon() {
        return this.iconName !== undefined && this.iconName !== null && this.iconName.length > 0;
    }

    handleLinkClick(event) {
        event.stopPropagation();
        const paletteItemClickEvent = new CustomEvent(PALETTE_ITEM_CLICKED, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                elementType: this.elementType,
                guid: this.guid
            }
        });
        this.dispatchEvent(paletteItemClickEvent);
    }
}