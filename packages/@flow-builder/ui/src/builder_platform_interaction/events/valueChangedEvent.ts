// @ts-nocheck
/**
 * Used by components to indicate that it's value has changed
 */
const eventName = 'valuechanged';

type ValueChangedEventDetail = {
    value?: string;
    error?: string;
};

export class ValueChangedEvent extends CustomEvent<ValueChangedEventDetail> {
    constructor(value = null, error = null) {
        super(eventName, {
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
