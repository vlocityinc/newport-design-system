const eventName = 'updatecondition';

export class UpdateConditionEvent extends Event {
    constructor(parentGUID, index, value) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });

        this.parentGUID = parentGUID;
        this.index = index;
        this.value = value;
    }

    static EVENT_NAME = eventName;
}