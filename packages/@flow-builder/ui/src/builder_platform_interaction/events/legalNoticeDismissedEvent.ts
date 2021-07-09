const eventName = 'legalnoticedismissed';

export class LegalNoticeDismissedEvent extends CustomEvent<{}> {
    constructor() {
        super(eventName, {
            cancelable: true,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
