const eventName = 'updatecondition';

export class UpdateConditionEvent extends Event {
    constructor(parentGUID, index, propertyName, value, error) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            parentGUID,
            index,
            propertyName,
            value,
            error
        };
    }

    static EVENT_NAME = eventName;
}