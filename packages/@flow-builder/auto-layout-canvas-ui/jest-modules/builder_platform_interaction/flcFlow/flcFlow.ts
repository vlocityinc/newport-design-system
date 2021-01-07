// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class FlcFlow extends LightningElement {
    @api
    flow;

    @api
    builderContext;

    @api
    isCanvasReady;

    @api
    disableAddElements;
}
