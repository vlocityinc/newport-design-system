/**
 * Used by waitEvent to indicate that one of its properties changed
 */
const eventName = 'waiteventpropertychanged';

export class WaitEventPropertyChangedEvent {
    constructor(propertyName, value, error = null, parentGUID, oldValue = undefined) {
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