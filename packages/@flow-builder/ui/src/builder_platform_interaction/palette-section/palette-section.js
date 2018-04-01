import { Element, api } from 'engine';

const TOGGLE_SECTION = 'togglesection';

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

    get toggleIconName() {
        return this.expanded ? 'utility:chevrondown' : 'utility:chevronright';
    }

    get toggleAlternativeText() {
        // TODO: Might not be good for i18n.
        const prefix = this.expanded ? 'Collapse' : 'Expand';
        return prefix + ' ' + this.label;
    }

    handleToggleClick() {
        const toggleSectionEvent = new CustomEvent(TOGGLE_SECTION, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                expanded: !this.expanded,
                sectionKey: this.sectionKey
            }
        });
        this.dispatchEvent(toggleSectionEvent);
    }
}