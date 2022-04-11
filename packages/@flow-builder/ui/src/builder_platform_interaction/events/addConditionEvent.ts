const eventName = 'addcondition';

export class AddConditionEvent extends CustomEvent<any> {
    constructor(parentGUID) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parentGUID
            }
        });
    }

    static EVENT_NAME = eventName;
}
