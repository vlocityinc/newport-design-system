const eventName = 'cannotretrievetemplates';

export class CannotRetrieveTemplatesEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: false,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
