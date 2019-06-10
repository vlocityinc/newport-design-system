/**
 * Used by waitEvent to indicate that input/output parameters changed
 */
const eventName = 'waiteventparameterchanged';

export class WaitEventParameterChangedEvent {
    constructor(
        name,
        value,
        valueDataType,
        error = null,
        parentGUID,
        isInputParameter,
        index = null
    ) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                name,
                value,
                valueDataType,
                error,
                parentGUID,
                isInputParameter,
                index
            }
        });
    }
    static EVENT_NAME = eventName;
}
