import { LightningElement, api } from 'lwc';

export default class CalloutEditorContainer extends LightningElement {
    @api selectedAction;
    @api getNode = jest.fn();
    @api validate = jest.fn();
}