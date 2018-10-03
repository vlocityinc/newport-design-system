/**
 * Used by waitEvent to indicate that input/output parameters changed
 */
const eventName = 'waiteventparameterchanged';

export class WaitEventParameterChangedEvent {
    constructor(parameterName, value, valueDataType, error = null, parentGUID = null, isInputParameter) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parameterName,
                value,
                valueDataType,
                error,
                parentGUID,
                isInputParameter,
            }
        });
    }
    static EVENT_NAME = eventName;
}