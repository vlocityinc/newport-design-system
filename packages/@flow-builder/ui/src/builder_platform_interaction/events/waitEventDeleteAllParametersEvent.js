/**
 * Used by waitEvent to indicate all parameters being deleted
 */
const eventName = 'waiteventdeleteallparameters';

export class WaitEventDeleteAllParametersEvent {
    constructor(parentGUID) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                parentGUID,
            }
        });
    }
    static EVENT_NAME = eventName;
}