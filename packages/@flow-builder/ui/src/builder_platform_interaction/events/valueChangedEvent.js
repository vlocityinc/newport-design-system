/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'valuechanged';

export class ValueChangedEvent extends Event {
    constructor(value = null, error = null) {
        super(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
        });
        this.value = value;
        this.error = error;
    }

    static EVENT_NAME = eventName;
}