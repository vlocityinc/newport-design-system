const eventName = 'cannotretrieveactions';

export class CannotRetrieveActionsEvent extends CustomEvent<null> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
