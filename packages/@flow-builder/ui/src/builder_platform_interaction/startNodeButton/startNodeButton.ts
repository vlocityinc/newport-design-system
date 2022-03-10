import { EditElementEvent } from 'builder_platform_interaction/events';
import { api, LightningElement } from 'lwc';
import { LABELS } from './startNodeButtonLabels';

export default abstract class StartNodeButton extends LightningElement {
    @api
    node!: UI.Start;

    /**
     * Dispatches an edit element event on click and for Enter/Space keys
     *
     * @fires EditElementEvent
     */
    @api
    performAction() {
        this.dispatchEvent(this.createEditElementEvent());
    }

    get unsetStartButtonClasses() {
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get startButtonClasses() {
        return 'start-button-trigger-context slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get editLabel() {
        return LABELS.startElementEdit;
    }

    /**
     * Creates an EditElementEvent.
     * Can be overriden in subclasses to provide the right edit element event
     *
     * @returns an edit element event
     */
    createEditElementEvent(): EditElementEvent {
        const canvasElementGUID = this.node.guid;
        return new EditElementEvent(canvasElementGUID, this.node.triggerType, undefined, true);
    }
}
