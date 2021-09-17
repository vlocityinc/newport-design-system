// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { LABELS } from './leftPanelResourcesLabels';
import { loggingUtils } from 'builder_platform_interaction/sharedUtils';
import { ShowResourceDetailsEvent } from 'builder_platform_interaction/events';

const leftPanelResources = 'LEFT_PANEL_RESOURCES';
const { logPerfTransactionStart, logPerfTransactionEnd } = loggingUtils;
export default class LeftPanelResources extends LightningElement {
    private elementToFocus: HTMLElement;

    @api
    canvasElements = [];

    @api
    nonCanvasElements = [];

    @api focus(elementGuid) {
        const palettes = this.template.querySelectorAll('builder_platform_interaction-palette');
        for (const palette of palettes) {
            const chevronElement = palette.findChevronElement(elementGuid);
            if (chevronElement) {
                this.elementToFocus = chevronElement.querySelector('.test-details-chevron-icon');
                this.forceRender();
                break;
            }
        }
    }

    constructor() {
        super();
        logPerfTransactionStart(leftPanelResources);
    }
    get labels() {
        return LABELS;
    }

    get showNonCanvasElementsLabel() {
        return this.nonCanvasElements.length > 0;
    }

    get showCanvasElementsLabel() {
        return this.canvasElements.length > 0;
    }

    /**
     * Add specific padding class for elements section header
     * depending on resources section header existence
     */
    get computedCanvasElementsSectionTitleClass() {
        return classSet('slds-text-title_caps slds-p-left_small').add({
            'slds-p-vertical_small': this.showNonCanvasElementsLabel,
            'slds-p-bottom_small': !this.showNonCanvasElementsLabel
        });
    }

    /**
     * Force renders the components
     */
    forceRender() {
        const nonCanvasElements = this.nonCanvasElements || [];
        // clone the array to force a render cycle
        this.nonCanvasElements = [...nonCanvasElements];
    }

    renderedCallback() {
        logPerfTransactionEnd(leftPanelResources, {
            canvasElementsCount: this.canvasElements.length,
            nonCanvasElementsCount: this.nonCanvasElements.length
        });
        if (this.elementToFocus != null) {
            this.elementToFocus.focus();
            this.elementToFocus = null;
        }
    }

    handleNonCanvasElementChevronClicked(event) {
        const showResourceDetailsEvent = new ShowResourceDetailsEvent(event.detail.elementGUID, false);
        this.dispatchEvent(showResourceDetailsEvent);
    }

    handleCanvasElementChevronClicked(event) {
        const showResourceDetailsEvent = new ShowResourceDetailsEvent(event.detail.elementGUID, true);
        this.dispatchEvent(showResourceDetailsEvent);
    }
}
