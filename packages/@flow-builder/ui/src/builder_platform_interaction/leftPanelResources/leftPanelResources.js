import { LightningElement, api } from 'lwc';
import { LABELS } from './leftPanelResourcesLabels';
import {
    logPerfTransactionStart,
    logPerfTransactionEnd
} from 'builder_platform_interaction/loggingUtils';
import { ShowResourceDetailsEvent } from 'builder_platform_interaction/events';

const leftPanelResources = 'LEFT_PANEL_RESOURCES';

export default class LeftPanelResources extends LightningElement {
    @api canvasElements = [];
    @api nonCanvasElements = [];

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

    renderedCallback() {
        logPerfTransactionEnd(leftPanelResources, {
            canvasElementsCount: this.canvasElements.length,
            nonCanvasElementsCount: this.nonCanvasElements.length
        });
    }

    handleNonCanvasElementChevronClicked(event) {
        const showResourceDetailsEvent = new ShowResourceDetailsEvent(
            event.detail.elementGUID,
            false
        );
        this.dispatchEvent(showResourceDetailsEvent);
    }

    handleCanvasElementChevronClicked(event) {
        const showResourceDetailsEvent = new ShowResourceDetailsEvent(
            event.detail.elementGUID,
            true
        );
        this.dispatchEvent(showResourceDetailsEvent);
    }
}
