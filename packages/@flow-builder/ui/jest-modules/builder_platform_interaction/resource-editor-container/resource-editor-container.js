import { LightningElement, api } from 'lwc';

export default class ResourceEditorContainer extends LightningElement {
    @api selectedResource;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}