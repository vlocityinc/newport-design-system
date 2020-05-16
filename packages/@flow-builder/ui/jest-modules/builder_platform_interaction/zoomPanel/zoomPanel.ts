// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class ZoomPanel extends LightningElement {
    @api
    showMarqueeButton;

    @api
    isMarqueeModeOn;

    @api
    isZoomOutDisabled;

    @api
    isZoomToView;

    @api
    isZoomInDisabled;
}
