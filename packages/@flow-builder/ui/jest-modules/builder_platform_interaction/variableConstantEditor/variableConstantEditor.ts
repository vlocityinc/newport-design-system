// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class VariableConstantEditor extends LightningElement {
    @api node;
    @api
    editorParams;
    @api isNewMode = false;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}
