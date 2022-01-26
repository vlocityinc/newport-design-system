import { FlowTestMode } from 'builder_platform_interaction/builderUtils';
import { api, LightningElement } from 'lwc';
import { LABELS } from './flowTestManagerLabels';

export default class FlowTestManager extends LightningElement {
    @api buttonCallback;
    @api hideModal;

    labels = LABELS;

    handleCreateNewTest() {
        this.hideModal();
        this.buttonCallback(FlowTestMode.CREATE);
    }
}
