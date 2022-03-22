import { ConnectionSource, MenuType } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'togglemenu';

interface ToggleMenuEventDetail {
    type: MenuType;
    source: ConnectionSource;
    moveFocusToMenu: boolean;
    top: number;
    left: number;
}

export class ToggleMenuEvent extends CustomEvent<ToggleMenuEventDetail> {
    constructor(detail: ToggleMenuEventDetail) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
