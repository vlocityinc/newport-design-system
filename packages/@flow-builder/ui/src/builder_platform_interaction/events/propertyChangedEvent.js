/**
 * Used by components to indicate that a property of the business element they represent
 * has changed
 */
const eventName = 'propertychanged';

export class PropertyChangedEvent extends Event {
    constructor(propertyName, value, error = null, guid = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.detail = {
            propertyName,
            value,
            error,
            guid
        };
    }

    static EVENT_NAME = eventName;
}