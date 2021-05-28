import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'deleteelementfault';

interface DeleteElementFaultEventDetail {
    guid: Guid;
}
export class DeleteElementFaultEvent extends CustomEvent<DeleteElementFaultEventDetail> {
    constructor(guid: string) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                guid
            }
        });
    }

    static EVENT_NAME = eventName;
}
