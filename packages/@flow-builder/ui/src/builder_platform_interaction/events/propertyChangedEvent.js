/**
 * Used by components to indicate that a property of the business element they represent
 * has changed
 */
const eventName = 'propertychanged';

export class PropertyChangedEvent extends Event {
    constructor(propertyName, value, error = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.propertyName = propertyName;
        this.value = value;
        this.error = error;
    }

    static EVENT_NAME = eventName;
}