// @ts-nocheck

/**
 * Used by waitEvent to indicate that event type is udpated.
 */
const eventName = 'updatewaiteventeventtype';

export class UpdateWaitEventEventTypeEvent {
    constructor(value, error = null, parentGUID, oldValue = undefined) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                propertyName: 'eventType',
                value,
                error,
                parentGUID,
                oldValue
            }
        });
    }
    static EVENT_NAME = eventName;
}
