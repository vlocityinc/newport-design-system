// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class AlcFlow extends LightningElement {
    @api
    flow;

    @api
    canvasMode;

    @api
    disableAddElements;

    @api
    activeElementGuid;

    @api
    disableDeleteElements;

    @api
    disableEditElements;

    @api
    flowModel;
}
