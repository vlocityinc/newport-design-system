/**
 * Used by canvas to select a connection
 */
const eventName = 'connectorselected';

export class ConnectorSelectedEvent {
    constructor(connectorGUID, isMultiSelectKeyPressed) {
        return new CustomEvent(eventName, {
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