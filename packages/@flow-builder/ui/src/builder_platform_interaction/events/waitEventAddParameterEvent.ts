/**
 * Used by waitEvent to indicate a new input parameter being added
 */
const eventName = 'waiteventaddparameter';

export class WaitEventAddParameterEvent extends CustomEvent<any> {
    constructor(name = null, parentGUID, isInputParameter) {
        super(eventName, {
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
