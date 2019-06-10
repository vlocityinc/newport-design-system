/**
 * Used to save a flow.
 */
const eventName = 'save';

export class SaveFlowEvent {
    constructor(type = null) {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true,
            detail: {
                type
            }
        });
    }

    static EVENT_NAME = eventName;

    static Type = {
        SAVE: 'save',
        SAVE_AS: 'saveas'
    };
}
