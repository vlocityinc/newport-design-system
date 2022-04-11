const eventName = 'editflowproperties';

export class EditFlowPropertiesEvent extends CustomEvent<any> {
    constructor() {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
