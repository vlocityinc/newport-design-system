/**
 * Used to save a flow.
 */
const eventName = 'save';

export class SaveFlowEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}