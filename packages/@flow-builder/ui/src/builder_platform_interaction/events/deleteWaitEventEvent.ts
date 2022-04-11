const eventName = 'deletewaitevent';

export class DeleteWaitEventEvent extends CustomEvent<any> {
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
