// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class StageEditor extends LightningElement {
    @api node;
    @api mode;
    @api processType;
    @api editorParams;
    @api isNewMode = false;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}
