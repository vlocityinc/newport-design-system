import { Element, api } from 'engine';

export default class FormulaEditor extends Element {
    @api isNewMode = false;
    @api node;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}