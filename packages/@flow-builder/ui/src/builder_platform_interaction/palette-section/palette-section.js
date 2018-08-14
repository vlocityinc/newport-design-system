import { LightningElement, api, track } from "lwc";
import { PaletteSectionToggleEvent } from 'builder_platform_interaction-events';

import palleteSectionToggleCollapseText from "@salesforce/label/FlowBuilderLeftPanel.palleteSectionToggleCollapseText";
import palleteSectionToggleExpandText from "@salesforce/label/FlowBuilderLeftPanel.palleteSectionToggleExpandText";

const LABELS = {
    COLLAPSE: palleteSectionToggleCollapseText,
    EXPAND: palleteSectionToggleExpandText
};

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * An interim component to give us lightning-tree-grid functionality. This will
 * be removed in the future once lightning-tree-grid satisfies our requirements.
 */

export default class PaletteSection extends LightningElement {
    @api sectionKey;
    @api label;
    @api expanded;
    @api itemCount;

    @track showCount = false;

    @api
    get showItemCount() {
        return this.showCount;
    }

    set showItemCount(value) {
        this.showCount = value === 'true';
    }

    get fullLabel() {
        return (this.showCount) ? this.label + ' (' + this.itemCount + ')' : this.label;
    }

    get toggleAlternativeText() {
        // TODO: Might not be good for i18n.
        const prefix = this.expanded ? LABELS.COLLAPSE : LABELS.EXPAND;
        return prefix + ' ' + this.label;
    }

    handleToggleClick() {
        const expanded = !this.expanded;
        const sectionKey = this.sectionKey;
        const paletteSectionToggleEvent = new PaletteSectionToggleEvent(expanded, sectionKey);
        this.dispatchEvent(paletteSectionToggleEvent);
    }
}