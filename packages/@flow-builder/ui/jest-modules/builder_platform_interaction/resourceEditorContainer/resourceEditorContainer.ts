// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class ResourceEditorContainer extends LightningElement {
    @api selectedResourceType;
    @api newResourceInfo;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}
