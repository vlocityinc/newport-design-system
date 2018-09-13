import { LightningElement, api } from 'lwc';
import { LABELS } from "./leftPanelResourcesLabels";
import { logPerfTransactionStart, logPerfTransactionEnd } from "builder_platform_interaction/loggingUtils";

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
        if (this.canvasElements && this.nonCanvasElements && (this.canvasElements.length > 0 || this.nonCanvasElements.length > 0)) {
            logPerfTransactionEnd(leftPanelResources, {
                canvasElementsCount: this.canvasElements.length,
                nonCanvasElementsCount: this.nonCanvasElements.length
            });
        }
    }
}