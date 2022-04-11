const eventName = 'cannotretrievecalloutparameters';

export class CannotRetrieveCalloutParametersEvent extends CustomEvent<any> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
