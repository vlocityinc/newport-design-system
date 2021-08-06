import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when the "goTo another component" or "reroute goto another component" connector menu item is selected
 */
const eventName = 'gotopath';

interface GoToPathEventDetail {
    next: Guid;
    prev: Guid;
    parent: Guid;
    childIndex: number;
    isReroute?: boolean;
}

export class GoToPathEvent extends CustomEvent<GoToPathEventDetail> {
    /**
     * @param next - the guid of the next element to reconnect
     * @param prev - the guid of the prev element (possibly null)
     * @param parent - the guid of the parent element (possibly null)
     * @param childIndex - index of branch on which GoTo is being added
     * @param isReroute - whether this is a reroute of an existing goto connection
     */
    constructor(next, prev, parent, childIndex, isReroute?) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                next,
                prev,
                parent,
                childIndex,
                isReroute
            }
        });
    }

    static EVENT_NAME = eventName;
}
