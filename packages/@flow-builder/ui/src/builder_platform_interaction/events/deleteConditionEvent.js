const eventName = 'deletecondition';

export class DeleteConditionEvent {
    constructor(parentGUID, index) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parentGUID,
                index
            }
        });
    }

    static EVENT_NAME = eventName;
}
