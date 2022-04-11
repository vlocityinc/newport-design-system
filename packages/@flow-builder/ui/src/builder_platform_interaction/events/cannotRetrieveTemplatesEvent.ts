const eventName = 'cannotretrievetemplates';

export class CannotRetrieveTemplatesEvent extends CustomEvent<null> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: false,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
