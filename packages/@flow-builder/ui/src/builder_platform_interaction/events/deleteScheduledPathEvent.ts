const eventName = 'deletescheduledpath';

export class DeleteScheduledPathEvent {
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
