// @ts-nocheck
const eventName = 'closemenu';

export class CloseMenuEvent extends CustomEvent {
    constructor() {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {}
        });
    }

    static EVENT_NAME = eventName;
}
