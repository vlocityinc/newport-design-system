/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'valuechanged';


export class ValueChangedEvent {
    constructor(value = null, error = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                value,
                error
            }
        });
    }

    static EVENT_NAME = eventName;
}