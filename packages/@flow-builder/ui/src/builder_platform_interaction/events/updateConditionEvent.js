const eventName = 'updatecondition';

export class UpdateConditionEvent extends Event {
    constructor(parentGUID, index, value) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });

        this.detail = {
            parentGUID,
            index,
            value
        };
    }

    static EVENT_NAME = eventName;
}