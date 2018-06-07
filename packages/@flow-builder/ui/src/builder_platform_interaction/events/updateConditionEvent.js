const eventName = 'updatecondition';


export class UpdateConditionEvent {
    constructor(parentGUID, index, value) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parentGUID,
                index,
                value
            }
        });
    }

    static EVENT_NAME = eventName;
}