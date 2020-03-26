const eventName = 'copysingleelement';
export class CopySingleElementEvent {
    constructor(elementGuid) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                elementGuid
            }
        });
    }

    static EVENT_NAME = eventName;
}
