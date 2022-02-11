import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestAssertionEditorLabels';

export default class FlowTestAssertionEditor extends LightningElement {
    labels = LABELS;

    @api
    assertionsList: UI.FlowTestAssertion[] = [];

    get showDeleteAssertion() {
        return this.assertionsList.length > 1;
    }
}
