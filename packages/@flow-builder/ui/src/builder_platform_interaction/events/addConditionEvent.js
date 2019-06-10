const eventName = 'addcondition';

export class AddConditionEvent {
    constructor(parentGUID) {
        return new CustomEvent(eventName, {
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
