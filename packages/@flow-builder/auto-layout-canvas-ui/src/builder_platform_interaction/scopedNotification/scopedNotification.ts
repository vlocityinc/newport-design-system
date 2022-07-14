import { AutoLayoutCanvasMode, isCutMode, isReconnectionMode } from 'builder_platform_interaction/alcComponentsUtils';
import { UpdateAutolayoutCanvasModeEvent } from 'builder_platform_interaction/alcEvents';
import { api, LightningElement } from 'lwc';
import { LABELS } from './scopedNotificationLabels';

export default class ScopedNotification extends LightningElement {
    @api
    canvasMode = AutoLayoutCanvasMode.SELECTION;

    @api
    numberOfElementsToPaste;

    labels = LABELS;

    get bodyText() {
        return isReconnectionMode(this.canvasMode)
            ? this.labels.connectBodyText
            : isCutMode(this.canvasMode)
            ? this.getTextForCutMode()
            : this.labels.selectBodyText;
    }

    getTextForCutMode() {
        return this.numberOfElementsToPaste > 1 ? this.labels.cutBodyMultipleText : this.labels.cutBodyText;
    }

    handleCancel(event) {
        event.preventDefault();
        const updateAutolayoutCanvasModeEvent = new UpdateAutolayoutCanvasModeEvent(AutoLayoutCanvasMode.DEFAULT);
        this.dispatchEvent(updateAutolayoutCanvasModeEvent);
    }
}
