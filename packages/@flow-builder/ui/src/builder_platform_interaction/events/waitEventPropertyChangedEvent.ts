/**
 * Used by waitEvent to indicate that one of its properties changed
 */
const eventName = 'waiteventpropertychanged';

export class WaitEventPropertyChangedEvent extends CustomEvent<any> {
    constructor(propertyName, value, error = null, parentGUID, oldValue = undefined) {
        super(eventName, {
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
