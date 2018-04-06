const eventName = 'deletecondition';

export class DeleteConditionEvent extends Event {
    constructor(parentGUID, index) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });

        this.parentGUID = parentGUID;
        this.index = index;
    }

    static EVENT_NAME = eventName;
}