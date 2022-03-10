const eventName = 'menurendered';

interface MenuRenderedEventDetail {
    width: number;
    height: number;
}

export class MenuRenderedEvent extends CustomEvent<MenuRenderedEventDetail> {
    constructor(width: number, height: number) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                width,
                height
            }
        });
    }

    static EVENT_NAME = eventName;
}
