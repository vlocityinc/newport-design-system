const eventName = 'deletescheduledpath';

export class DeleteScheduledPathEvent extends CustomEvent<any> {
    constructor(guid) {
        super(eventName, {
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
