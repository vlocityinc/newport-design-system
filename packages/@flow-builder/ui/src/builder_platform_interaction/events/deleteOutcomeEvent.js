const eventName = 'deleteoutcome';

export class DeleteOutcomeEvent extends Event {
    constructor(guid) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });

        this.detail = {
            guid
        };
    }

    static EVENT_NAME = eventName;
}