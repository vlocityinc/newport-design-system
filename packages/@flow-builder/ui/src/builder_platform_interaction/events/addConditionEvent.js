const eventName = 'addcondition';

export class AddConditionEvent extends Event {
    constructor(parentGUID) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            parentGUID
        };
    }

    static EVENT_NAME = eventName;
}