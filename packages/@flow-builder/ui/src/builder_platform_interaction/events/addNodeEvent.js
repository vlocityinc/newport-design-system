// @ts-nocheck
const eventName = 'addnode';

export class AddNodeEvent {
    constructor(node) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                node
            }
        });
    }

    static EVENT_NAME = eventName;
}
