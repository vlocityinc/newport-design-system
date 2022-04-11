const eventName = 'updateconditionlogic';

export class UpdateConditionLogicEvent extends CustomEvent<any> {
    constructor(parentGUID, value) {
        super(eventName, {
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
