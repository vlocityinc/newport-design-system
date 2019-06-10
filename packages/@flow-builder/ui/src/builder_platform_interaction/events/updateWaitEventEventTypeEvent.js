import { WAIT_EVENT_FIELDS } from 'builder_platform_interaction/flowMetadata';

/**
 * Used by waitEvent to indicate that event type is udpated.
 */
const eventName = 'updatewaiteventeventtype';
// property name for event type 'eventType'
const propertyName = WAIT_EVENT_FIELDS.EVENT_TYPE;
export class UpdateWaitEventEventTypeEvent {
    constructor(value, error = null, parentGUID, oldValue = undefined) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                propertyName,
                value,
                error,
                parentGUID,
                oldValue
            }
        });
    }
    static EVENT_NAME = eventName;
}
