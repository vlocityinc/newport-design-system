/**
 * Used by canvas to select a connection
 */
const eventName = 'connectorselected';

export class ConnectorSelectedEvent extends CustomEvent<any> {
    constructor(connectorGUID, isMultiSelectKeyPressed) {
        super(eventName, {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
                connectorGUID,
                isMultiSelectKeyPressed
            }
        });
    }

    static EVENT_NAME = eventName;
}
