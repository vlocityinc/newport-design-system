import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when focus needs to be moved to the connector
 */
const eventName = 'movefocustoconnector';

interface MoveFocusToConnectorEventDetail {
    source: ConnectionSource;
}

export class MoveFocusToConnectorEvent extends CustomEvent<MoveFocusToConnectorEventDetail> {
    /**
     * @param source - The connection source
     */
    constructor(source: ConnectionSource) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                source
            }
        });
    }

    static EVENT_NAME = eventName;
}
