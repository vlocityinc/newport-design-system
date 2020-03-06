import { LightningElement, api } from 'lwc';

export default class HelpMenuItem extends LightningElement {
    @api type;
    @api label;
    @api unmuteLabel;
    @api count;
    @api helpUrl;
    @api running;
}
