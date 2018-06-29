import { Element, api } from 'engine';

export default class VariableEditor extends Element {
    @api node;
    @api isNewMode = false;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}