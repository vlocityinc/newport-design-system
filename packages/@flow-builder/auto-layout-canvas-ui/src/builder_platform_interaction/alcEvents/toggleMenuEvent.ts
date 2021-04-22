import { Guid, ElementMetadata, MenuType } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'togglemenu';

interface ToggleMenuEventDetail {
    top: number;
    left: number;
    offsetX: number;
    type: MenuType;
    elementMetadata: ElementMetadata;

    prev?: Guid;
    next?: Guid;
    guid?: Guid;
    parent?: Guid;
    childIndex?: number;
    isOpenedWithKeyboard?: boolean;
}

export class ToggleMenuEvent extends CustomEvent<ToggleMenuEventDetail> {
    constructor(detail) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail
        });
    }

    static EVENT_NAME = eventName;
}
