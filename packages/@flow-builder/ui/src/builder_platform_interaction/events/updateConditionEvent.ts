// @ts-nocheck
import { Guid, Condition } from 'builder_platform_interaction/flowModel';

const eventName = 'updatecondition';

type UpdateConditionEventDetail = {
    parentGUID: Guid;
    index: number;
    value: Condition;
};

export class UpdateConditionEvent extends CustomEvent<UpdateConditionEventDetail> {
    constructor(parentGUID: Guid, index: number, value: Condition) {
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
