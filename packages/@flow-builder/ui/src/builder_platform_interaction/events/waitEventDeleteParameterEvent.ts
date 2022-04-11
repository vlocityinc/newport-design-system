/**
 * Used by waitEvent to indicate an input parameters being deleted
 */
const eventName = 'waiteventdeleteparameter';

export class WaitEventDeleteParameterEvent extends CustomEvent<any> {
    constructor(name = null, parentGUID, isInputParameter, index = null) {
        super(eventName, {
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
