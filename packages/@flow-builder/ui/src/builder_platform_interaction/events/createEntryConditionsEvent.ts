const eventName = 'createentryconditions';

type CreateEntryConditionsEventDetail = {
    guid: UI.Guid;
};

export class CreateEntryConditionsEvent extends CustomEvent<CreateEntryConditionsEventDetail> {
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
