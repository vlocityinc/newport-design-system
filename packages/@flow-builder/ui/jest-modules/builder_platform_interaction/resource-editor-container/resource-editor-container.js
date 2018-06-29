import { Element, api } from 'engine';

export default class ResourceEditorContainer extends Element {
    @api selectedResource;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}