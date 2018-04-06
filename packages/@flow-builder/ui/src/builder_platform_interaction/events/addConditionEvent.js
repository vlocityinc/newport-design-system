const eventName = 'addcondition';

export class AddConditionEvent extends Event {
    constructor(parentGUID) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.parentGUID = parentGUID;
    }

    static EVENT_NAME = eventName;
}