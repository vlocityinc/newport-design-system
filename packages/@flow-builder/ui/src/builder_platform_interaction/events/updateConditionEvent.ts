const eventName = 'updatecondition';

type UpdateConditionEventDetail = {
    parentGUID: UI.Guid;
    index: number;
    value: UI.Condition;
};

export class UpdateConditionEvent extends CustomEvent<UpdateConditionEventDetail> {
    constructor(parentGUID: UI.Guid, index: number, value: UI.Condition) {
        super(eventName, {
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
