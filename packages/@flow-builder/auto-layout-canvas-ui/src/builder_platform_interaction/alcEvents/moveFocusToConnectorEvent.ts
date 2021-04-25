import { Guid } from 'builder_platform_interaction/autoLayoutCanvas';

/**
 * Event fired when focus needs to be moved to the connector
 */
const eventName = 'movefocustoconnector';

interface MoveFocusToConnectorEventDetail {
    focusGuid: Guid;
    index: number;
}

export class MoveFocusToConnectorEvent extends CustomEvent<MoveFocusToConnectorEventDetail> {
    /**
     * @param focusGuid - Guid of the focus connector's source element
     * @param index - Index of the ficus branch (if any)
     */
    constructor(focusGuid: Guid, index: number) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                focusGuid,
                index
            }
        });
    }

    static EVENT_NAME = eventName;
}
