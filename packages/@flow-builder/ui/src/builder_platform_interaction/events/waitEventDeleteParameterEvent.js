/**
 * Used by waitEvent to indicate an input parameters being deleted
 */
const eventName = 'waiteventdeleteparameter';

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
