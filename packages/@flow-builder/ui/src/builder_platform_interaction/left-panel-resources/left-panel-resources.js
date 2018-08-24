import { LightningElement, api } from 'lwc';
import { LABELS } from './left-panel-resources-labels';
import { logPerfMarkStart, logPerfMarkEnd } from 'builder_platform_interaction-logging-utils';

const leftPanelResources = 'leftPanelResources';

export default class LeftPanelResources extends LightningElement {
    @api canvasElements = [];
    @api nonCanvasElements = [];

    constructor() {
        super();
        logPerfMarkStart(leftPanelResources);
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
            logPerfMarkEnd(leftPanelResources, {
                canvasElementsCount: this.canvasElements.length,
                nonCanvasElementsCount: this.nonCanvasElements.length
            });
        }
    }
}