import { Element, api } from 'engine';

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */
export default class PaletteItem extends Element {
    @api label;
    @api iconName;
}