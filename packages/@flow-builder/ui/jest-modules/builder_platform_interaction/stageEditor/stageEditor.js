import { LightningElement, api } from 'lwc';

export default class StageEditor extends LightningElement {
    @api node;
    @api isNewMode = false;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}