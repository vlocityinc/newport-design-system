/**
 * Used by waitEvent to indicate a new input parameter being added
 */
const eventName = 'waiteventaddparameter';

export class WaitEventAddParameterEvent {
    constructor(parentGUID = null, isInputParameter) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parentGUID,
                isInputParameter,
            }
        });
    }
    static EVENT_NAME = eventName;
}