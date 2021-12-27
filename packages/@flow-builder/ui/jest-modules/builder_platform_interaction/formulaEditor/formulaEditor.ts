// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class FormulaEditor extends LightningElement {
    @api isNewMode = false;
    @api node;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}
