// @ts-nocheck
import { Guid } from 'builder_platform_interaction/flowModel';

const eventName = 'deletecondition';

type DeleteConditionEventDetail = {
    parentGUID: Guid;
    index: number;
};

export class DeleteConditionEvent extends CustomEvent<DeleteConditionEventDetail> {
    constructor(parentGUID, index) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parentGUID,
                index
            }
        });
    }

    static EVENT_NAME = eventName;
}
