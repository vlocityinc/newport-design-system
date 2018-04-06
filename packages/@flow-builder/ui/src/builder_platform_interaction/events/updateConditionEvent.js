const eventName = 'updatecondition';

export class UpdateConditionEvent extends Event {
    constructor(parentGUID, index, propertyName, value, error) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });

        this.parentGUID = parentGUID;
        this.index = index;
        this.propertyName = propertyName;
        this.value = value;
        this.error = error;
    }

    static EVENT_NAME = eventName;
}