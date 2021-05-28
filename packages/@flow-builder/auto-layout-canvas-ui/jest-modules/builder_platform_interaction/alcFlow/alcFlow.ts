// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class AlcFlow extends LightningElement {
    @api
    flow;

    @api
    canvasMode;

    @api
    disableAddElements;
}
