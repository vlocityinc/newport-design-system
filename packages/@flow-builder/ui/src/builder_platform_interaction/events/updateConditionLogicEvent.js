const eventName = 'updateconditionlogic';

export class UpdateConditionLogicEvent {
    constructor(parentGUID, value) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parentGUID,
                value
            }
        });
    }

    static EVENT_NAME = eventName;
}
