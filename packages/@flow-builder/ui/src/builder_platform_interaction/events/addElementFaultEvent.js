const eventName = 'addelementfault';

export class AddElementFaultEvent extends CustomEvent {
    constructor(guid) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guid
            }
        });
    }

    static EVENT_NAME = eventName;
}
