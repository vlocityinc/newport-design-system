import { LightningElement, api } from 'lwc';

export default class LightningTabSet extends LightningElement {
    @api title;
    @api variant = jest.fn();
    @api activeTabValue;
}
