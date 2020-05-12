// @ts-nocheck
const eventName = 'toggleselectionmode';

export class ToggleSelectionModeEvent {
    constructor() {
        return new CustomEvent(eventName, {
            cancelable: false,
            composed: true,
            bubbles: true
        });
    }

    static EVENT_NAME = eventName;
}
