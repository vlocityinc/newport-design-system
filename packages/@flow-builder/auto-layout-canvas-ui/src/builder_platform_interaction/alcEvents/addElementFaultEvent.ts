import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

const eventName = 'addelementfault';
interface AddElementFaultEventDetail {
    guid: Guid;
}
export class AddElementFaultEvent extends CustomEvent<AddElementFaultEventDetail> {
    constructor(guid: Guid) {
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
