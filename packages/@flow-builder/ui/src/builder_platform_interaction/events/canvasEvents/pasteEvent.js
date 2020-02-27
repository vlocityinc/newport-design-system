const eventName = 'paste';
export class PasteEvent {
    constructor(prev, next, parent, childIndex) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                prev,
                next,
                parent,
                childIndex
            }
        });
    }

    static EVENT_NAME = eventName;
}
