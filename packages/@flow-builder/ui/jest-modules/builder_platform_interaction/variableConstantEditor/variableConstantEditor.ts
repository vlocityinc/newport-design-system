// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class VariableConstantEditor extends LightningElement {
    @api node;
    @api
    editorParams;
    @api isNewMode = false;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}
