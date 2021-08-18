import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when the "goTo another component" or "reroute goto another component" connector menu item is selected
 */
const eventName = 'gotopath';

interface GoToPathEventDetail {
    source: ConnectionSource;
    isReroute?: boolean;
}

export class GoToPathEvent extends CustomEvent<GoToPathEventDetail> {
    /**
     * @param source - The connection source
     * @param isReroute - whether this is a reroute of an existing goto connection
     */
    constructor(source: ConnectionSource, isReroute = false) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                source,
                isReroute
            }
        });
    }

    static EVENT_NAME = eventName;
}
