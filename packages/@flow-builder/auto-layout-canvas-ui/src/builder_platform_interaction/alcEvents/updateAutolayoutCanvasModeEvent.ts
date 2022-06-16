import { AutoLayoutCanvasMode } from 'builder_platform_interaction/alcComponentsUtils';
const eventName = 'updateautolayoutcanvasmode';

interface UpdateAutolayoutCanvasModeEventDetail {
    mode: AutoLayoutCanvasMode;
}

export class UpdateAutolayoutCanvasModeEvent extends CustomEvent<UpdateAutolayoutCanvasModeEventDetail> {
    constructor(mode: AutoLayoutCanvasMode) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                mode
            }
        });
    }

    static EVENT_NAME = eventName;
}
