import { LightningElement, api } from 'lwc';

export default class LightingTab extends LightningElement {
    @api loadContent = jest.fn();
    @api label = jest.fn();
}