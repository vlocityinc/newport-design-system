const eventName = 'deletewaitevent';

export class DeleteWaitEventEvent {
    constructor(guid) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                guid
            }
        });
    }

    static EVENT_NAME = eventName;
}
