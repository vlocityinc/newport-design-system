import { Element, api } from 'engine';
import { LABELS } from './left-panel-resources-labels';

export default class LeftPanelResources extends Element {
    @api canvasElements;

    @api nonCanvasElements;

    get labels() {
        return LABELS;
    }

    get showNonCanvasElementsLabel() {
        return this.nonCanvasElements.length > 0;
    }

    get showCanvasElementsLabel() {
        return this.canvasElements.length > 0;
    }
}