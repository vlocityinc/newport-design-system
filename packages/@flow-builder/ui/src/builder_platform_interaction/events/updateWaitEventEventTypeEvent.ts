/**
 * Used by waitEvent to indicate that event type is udpated.
 */
const eventName = 'updatewaiteventeventtype';

export class UpdateWaitEventEventTypeEvent extends CustomEvent<any> {
    constructor(value, error = null, parentGUID, oldValue = undefined) {
        super(eventName, {
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
