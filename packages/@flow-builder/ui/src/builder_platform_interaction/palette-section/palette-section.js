import { Element, api } from 'engine';
import { PaletteSectionToggleEvent } from 'builder_platform_interaction-events';

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */
export default class PaletteSection extends Element {
    @api sectionKey;
    @api label;
    @api expanded;

    get toggleAlternativeText() {
        // TODO: Might not be good for i18n.
        const prefix = this.expanded ? 'Collapse' : 'Expand';
        return prefix + ' ' + this.label;
    }

    handleToggleClick() {
        const expanded = !this.expanded;
        const sectionKey = this.sectionKey;
        const paletteSectionToggleEvent = new PaletteSectionToggleEvent(expanded, sectionKey);
        this.dispatchEvent(paletteSectionToggleEvent);
    }
}