/**
 * Used by waitEvent to indicate an input parameters being deleted
 */
const eventName = 'waiteventdeleteparameter';

// TODO: Add name parameter and make index optional.  This will be needed for output parameters
export class WaitEventDeleteParameterEvent {
    constructor(name = null, parentGUID, isInputParameter, index = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                name,
                parentGUID,
                isInputParameter,
                index
            }
        });
    }
    static EVENT_NAME = eventName;
}
