/**
 * Used by waitEvent to indicate a new input parameter being added
 */
const eventName = 'waiteventaddparameter';

export class WaitEventAddParameterEvent {
    constructor(name = null, parentGUID, isInputParameter) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                name,
                parentGUID,
                isInputParameter
            }
        });
    }
    static EVENT_NAME = eventName;
}
