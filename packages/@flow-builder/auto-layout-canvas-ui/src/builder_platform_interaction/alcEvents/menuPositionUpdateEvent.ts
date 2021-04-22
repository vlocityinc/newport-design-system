const eventName = 'menupositionupdate';

interface MenuPositionUpdateEventDetail {
    top: number;
    left: number;
    offsetX: number;
}

export class MenuPositionUpdateEvent extends CustomEvent<MenuPositionUpdateEventDetail> {
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
