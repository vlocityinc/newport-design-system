// @ts-nocheck
const eventName = 'updatenode';

export class UpdateNodeEvent {
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
