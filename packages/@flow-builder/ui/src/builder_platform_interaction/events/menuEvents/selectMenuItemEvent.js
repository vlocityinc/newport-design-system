// @ts-nocheck
const eventName = 'selectmenuitem';
export class SelectMenuItemEvent extends CustomEvent {
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
