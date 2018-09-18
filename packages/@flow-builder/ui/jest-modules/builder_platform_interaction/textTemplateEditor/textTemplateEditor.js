import { LightningElement, api } from 'lwc';

export default class TextTemplateEditor extends LightningElement {
    @api node;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}