// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class CalloutEditorContainer extends LightningElement {
    @api selectedAction;
    @api getNode = jest.fn();
    @api validate = jest.fn();
    @api hasActions;
    @api location;
    @api filterBy;
    @api editorParams;
    @api invocableActionsFetched;
    @api invocableActions;
    @api processType;
}
