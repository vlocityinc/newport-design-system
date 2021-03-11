import { LightningElement, api } from 'lwc';

export default class PrimitiveIcon extends LightningElement {
    @api src;
    @api svgClass;
    @api size;
    @api variant;
    @api iconName;
}
