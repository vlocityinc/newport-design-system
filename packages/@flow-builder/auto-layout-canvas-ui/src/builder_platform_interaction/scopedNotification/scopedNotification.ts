import { AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
import { ToggleSelectionModeEvent } from 'builder_platform_interaction/events';
import { api, LightningElement } from 'lwc';
import { LABELS } from './scopedNotificationLabels';

export default class ScopedNotification extends LightningElement {
    @api
    canvasMode = AutoLayoutCanvasMode.SELECTION;

    labels = LABELS;

    get bodyText() {
        return this.canvasMode === AutoLayoutCanvasMode.RECONNECTION
            ? this.labels.connectBodyText
            : this.labels.selectBodyText;
    }

    handleCancel(event) {
        event.preventDefault();
        const toggleSelectionModeEvent = new ToggleSelectionModeEvent();
        this.dispatchEvent(toggleSelectionModeEvent);
    }
}
