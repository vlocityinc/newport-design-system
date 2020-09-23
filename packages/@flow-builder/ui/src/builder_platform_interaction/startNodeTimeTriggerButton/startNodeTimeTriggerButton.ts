// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './startNodeTimeTriggerButtonLabels';
import { EditElementEvent } from 'builder_platform_interaction/events';
import { EDIT_START_TIME_TRIGGERS } from 'builder_platform_interaction/elementConfig';

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

    handleObjectClick = (event) => {
        event.stopPropagation();
        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, EDIT_START_TIME_TRIGGERS);
        this.dispatchEvent(editElementEvent);
    };
}
