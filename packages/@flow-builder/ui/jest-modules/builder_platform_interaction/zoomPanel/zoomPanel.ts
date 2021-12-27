// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class ZoomPanel extends LightningElement {
    @api
    showMarqueeButton;

    @api
    isMarqueeModeOn;

    @api
    isZoomOutDisabled;

    @api
    isZoomInDisabled;
}
