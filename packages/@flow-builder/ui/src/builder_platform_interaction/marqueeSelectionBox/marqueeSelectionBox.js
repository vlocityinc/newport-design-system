import { LightningElement, api } from "lwc";

export default class MarqueeSelectionBox extends LightningElement {
    @api marqueeStartPoint = [0, 0];
    @api marqueeEndPoint = [0, 0];

    get getBoxLocationAndDimension() {
        const boxLeft = Math.min(this.marqueeStartPoint[0], this.marqueeEndPoint[0]);
        const boxTop = Math.min(this.marqueeStartPoint[1], this.marqueeEndPoint[1]);
        const boxWidth = Math.abs(this.marqueeEndPoint[0] - this.marqueeStartPoint[0]);
        const boxHeight = Math.abs(this.marqueeEndPoint[1] - this.marqueeStartPoint[1]);

        return `left: ${boxLeft}px; top: ${boxTop}px; width: ${boxWidth}px; height: ${boxHeight}px;`;
    }
}