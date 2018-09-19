/**
 * Used by waitEvent to indicate that one of its properties changed
 */
const eventName = 'waiteventpropertychanged';

export class WaitEventPropertyChangedEvent {
    constructor(propertyName, value, error = null, guid = null, oldValue = undefined) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                propertyName,
                value,
                error,
                guid,
                oldValue
            }
        });
    }
    static EVENT_NAME = eventName;
}