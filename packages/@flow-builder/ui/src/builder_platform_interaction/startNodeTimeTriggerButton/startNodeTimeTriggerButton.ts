// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './startNodeTimeTriggerButtonLabels';

export default class startNodeTimeTriggerButton extends LightningElement {
    @api
    node = {
        config: {}
    };

    get unsetStartButtonClasses() {
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get setTimeTiggerLabel() {
        return LABELS.startElementSetTimeTrigger;
    }

    // TODO
    get isTimeTriggerSet() {
        return false;
    }

    // TODO
    handleObjectClick = (event) => {
        event.stopPropagation();
    };
}
