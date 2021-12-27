// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class TextTemplateEditor extends LightningElement {
    @api node;
    @api
    editorParams;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}
