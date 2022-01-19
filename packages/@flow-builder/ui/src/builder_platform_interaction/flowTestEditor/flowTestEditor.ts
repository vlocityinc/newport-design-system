import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestEditorLabels';

export default class FlowTestEditor extends LightningElement {
    @api buttonCallback;
    @api hideModal;

    labels = LABELS;

    handleCreateNewTest() {
        this.hideModal();
        // TODO: Call the create new test function
        // this.buttonCallback('create test');
    }
}
