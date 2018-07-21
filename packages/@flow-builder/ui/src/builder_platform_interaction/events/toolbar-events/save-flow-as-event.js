/**
 * Used to save a flow as a new version or definition.
 */
const eventName = 'saveas';

// TODO: Consolidate this with save-flow-event instead.
export class SaveFlowAsEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}