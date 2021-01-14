// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class FlcFlow extends LightningElement {
    @api
    flow;

    @api
    canvasMode;

    @api
    isCanvasReady;

    @api
    disableAddElements;
}
