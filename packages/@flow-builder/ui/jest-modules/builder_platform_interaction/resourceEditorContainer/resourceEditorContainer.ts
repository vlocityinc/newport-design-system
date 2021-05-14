// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class ResourceEditorContainer extends LightningElement {
    @api selectedResourceType;
    @api newResourceInfo;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}
